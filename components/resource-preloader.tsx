"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { allResourceManifest, resourcesForRoute, type PreloadResourceGroup } from "../src/data/resources/preload";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

const MAX_CONCURRENT_REQUESTS = 3;
const RESOURCE_COMPLETION_TIMEOUT_MS = 60_000;

type QueuePriority = "background" | "page" | "critical";
type QueuedResource = { url: string; priority: QueuePriority; order: number };

const priorityRank: Record<QueuePriority, number> = { background: 0, page: 1, critical: 2 };
const loadedResources = new Set<string>();
const inFlightResources = new Map<string, Promise<void>>();
const queuedResources = new Map<string, QueuedResource>();
let queueOrder = 0;
let activeResourceLoads = 0;
let routePriorityPending = true;
let documentHidden = false;
let allResourcesQueued = false;

function resourceUrls(group: PreloadResourceGroup) {
  return [...group.syllabi, ...group.images];
}

function hasCompletedResourceTiming(url: string) {
  return performance.getEntriesByName(url, "resource")
    .some((entry) => (entry as PerformanceResourceTiming).responseEnd > 0);
}

function trackResourceCompletion(url: string, startedAt: number) {
  let observer: PerformanceObserver | null = null;
  let timeout = 0;
  let settled = false;
  let finish: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    finish = () => {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      window.clearTimeout(timeout);
      resolve();
    };
    const completed = performance.getEntriesByName(url, "resource")
      .some((entry) => (entry as PerformanceResourceTiming).responseEnd > 0 && entry.startTime >= startedAt - 1);
    if (completed) {
      finish();
      return;
    }
    if ("PerformanceObserver" in window) {
      observer = new PerformanceObserver((list) => {
        if (list.getEntries().some((entry) => entry.name === url && (entry as PerformanceResourceTiming).responseEnd > 0)) finish();
      });
      observer.observe({ type: "resource", buffered: true });
    }
    timeout = window.setTimeout(finish, RESOURCE_COMPLETION_TIMEOUT_MS);
  });
  return { promise, cancel: finish };
}

async function prewarmResource(url: string, priority: QueuePriority) {
  if (hasCompletedResourceTiming(url)) {
    loadedResources.add(url);
    return;
  }
  const tracker = trackResourceCompletion(url, performance.now());
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      mode: "no-cors",
      priority: priority === "critical" ? "high" : "low",
    } as RequestInit);
    if (response.type !== "opaque" && !response.ok) throw new Error(`HTTP ${response.status}`);
    await tracker.promise;
    loadedResources.add(url);
  } catch {
    // A visible image or iframe can retry normally if speculative warming fails.
  } finally {
    tracker.cancel();
  }
}

function nextQueuedResource() {
  if (documentHidden) return null;
  const candidates = [...queuedResources.values()]
    .filter((entry) => !routePriorityPending || entry.priority === "critical")
    .sort((left, right) => priorityRank[right.priority] - priorityRank[left.priority] || left.order - right.order);
  return candidates[0] ?? null;
}

function pumpQueue() {
  while (activeResourceLoads < MAX_CONCURRENT_REQUESTS) {
    const entry = nextQueuedResource();
    if (!entry) return;
    queuedResources.delete(entry.url);
    if (loadedResources.has(entry.url) || inFlightResources.has(entry.url)) continue;
    activeResourceLoads += 1;
    const request = prewarmResource(entry.url, entry.priority);
    inFlightResources.set(entry.url, request);
    void request.finally(() => {
      if (inFlightResources.get(entry.url) === request) inFlightResources.delete(entry.url);
      activeResourceLoads -= 1;
      pumpQueue();
    });
  }
}

function enqueueGroup(group: PreloadResourceGroup, priority: QueuePriority) {
  for (const url of resourceUrls(group)) {
    if (loadedResources.has(url) || inFlightResources.has(url)) continue;
    if (hasCompletedResourceTiming(url)) {
      loadedResources.add(url);
      queuedResources.delete(url);
      continue;
    }
    const current = queuedResources.get(url);
    if (current) {
      if (priorityRank[priority] > priorityRank[current.priority]) current.priority = priority;
      continue;
    }
    queuedResources.set(url, { url, priority, order: queueOrder++ });
  }
  pumpQueue();
}

function demoteQueuedResources() {
  for (const entry of queuedResources.values()) entry.priority = "background";
}

function adoptDocumentImageLoads() {
  for (const image of document.images) {
    const url = image.currentSrc || image.src;
    if (!url || loadedResources.has(url) || inFlightResources.has(url)) continue;
    if (image.complete) {
      if (image.naturalWidth > 0) loadedResources.add(url);
      continue;
    }
    const request = new Promise<void>((resolve) => {
      const finish = () => {
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        if (image.naturalWidth > 0) loadedResources.add(url);
        resolve();
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
    });
    inFlightResources.set(url, request);
    void request.finally(() => {
      if (inFlightResources.get(url) === request) inFlightResources.delete(url);
      queuedResources.delete(url);
      pumpQueue();
    });
  }
}

function scheduleIdle(callback: () => void) {
  const idleWindow = window as unknown as IdleWindow;
  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 1500 });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(callback, 180);
  return () => window.clearTimeout(handle);
}

function scheduleAfterFirstFrameAndIdle(callback: () => void, afterFrames: () => void = () => undefined) {
  let firstFrame = 0;
  let secondFrame = 0;
  let cancelIdle: () => void = () => undefined;
  firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(() => {
      afterFrames();
      cancelIdle = scheduleIdle(callback);
    });
  });
  return () => {
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
    cancelIdle();
  };
}

function allowsBackgroundPreload() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !connection?.saveData && connection?.effectiveType !== "slow-2g" && connection?.effectiveType !== "2g";
}

export function ResourcePreloader() {
  const pathname = usePathname();

  useEffect(() => {
    const { critical, page } = resourcesForRoute(pathname);
    routePriorityPending = true;
    document.documentElement.classList.add("route-transitioning");
    demoteQueuedResources();
    adoptDocumentImageLoads();
    enqueueGroup(critical, "critical");
    const cancelScheduled = scheduleAfterFirstFrameAndIdle(() => {
      adoptDocumentImageLoads();
      if (allowsBackgroundPreload()) enqueueGroup(page, "page");
      routePriorityPending = false;
      pumpQueue();
    }, () => document.documentElement.classList.remove("route-transitioning"));
    return () => {
      cancelScheduled();
      routePriorityPending = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (allResourcesQueued || !allowsBackgroundPreload()) return;
    return scheduleAfterFirstFrameAndIdle(() => {
      if (allResourcesQueued) return;
      allResourcesQueued = true;
      enqueueGroup(allResourceManifest, "background");
    });
  }, []);

  useEffect(() => {
    const syncVisibility = () => {
      documentHidden = document.hidden;
      document.documentElement.classList.toggle("document-hidden", documentHidden);
      if (!documentHidden) pumpQueue();
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return null;
}
