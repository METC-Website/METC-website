"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Language } from "../../content";
import { feedbacks, voicesPageCopy, type StudentFeedback } from "../../content/voices";
import { feedbackVisualSeed } from "../../lib/feedback-visual-seed";
import { clearViewedFeedbackIds, readViewedFeedbackIds, writeViewedFeedbackIds } from "../../lib/viewed-feedback-cookie";
import { SiteFooter } from "../homepage/site-footer";
import { SiteHeader } from "../homepage/site-header";

const LANGUAGE_STORAGE_KEY = "metc-language";

type NodeStyle = CSSProperties & Record<`--voice-${string}`, string>;

function FeedbackNode({ feedback, index, total, language, viewed, guided, opening, onOpen }: {
  feedback: StudentFeedback;
  index: number;
  total: number;
  language: Language;
  viewed: boolean;
  guided: boolean;
  opening: boolean;
  onOpen: (feedback: StudentFeedback, trigger: HTMLButtonElement) => void;
}) {
  const copy = voicesPageCopy[language];
  const seed = feedbackVisualSeed(feedback.id, index, total);
  const style: NodeStyle = {
    "--voice-x": `${seed.x}%`,
    "--voice-y": `${seed.y}%`,
    "--voice-scale": String(seed.scale),
    "--voice-rotation": `${seed.rotation}deg`,
    "--voice-twinkle": `${seed.twinkleDuration}s`,
    "--voice-delay": `${seed.twinkleDelay}s`,
    "--voice-drift": `${seed.driftDuration}s`,
    "--voice-drift-x": `${seed.driftX}px`,
    "--voice-drift-y": `${seed.driftY}px`
  };
  const status = viewed ? copy.opened : copy.unopened;
  const action = viewed ? copy.reopen : copy.open;
  const label = `${action} · ${copy.voice} ${index + 1} · ${status}`;

  return <button className={`feedback-node feedback-node-${feedback.variant} feedback-node-${feedback.accent}${viewed ? " is-viewed" : ""}${guided ? " is-guided" : ""}${opening ? " is-opening" : ""}`} type="button" style={style} onClick={(event) => onOpen(feedback, event.currentTarget)} aria-label={label} aria-busy={opening}>
    <span className="feedback-node-orbit" aria-hidden="true"><span className="feedback-node-shape feedback-envelope"><i className="feedback-envelope-paper" /><i className="feedback-envelope-pocket" /><i className="feedback-envelope-flap" /></span></span>
    <span className="feedback-node-tooltip" aria-hidden="true">{guided ? copy.nextUp : action}</span>
  </button>;
}

function DecorativeStars() {
  return <div className="voices-decorative-stars" aria-hidden="true">
    {Array.from({ length: 12 }, (_, index) => <i key={index} className={`decorative-star decorative-star-${index % 6}`} />)}
  </div>;
}

function VoicesWeather() {
  return <div className="voices-weather" aria-hidden="true">
    {Array.from({ length: 4 }, (_, index) => <i key={`snow-${index}`} className={`voices-snow voices-snow-${index}`} />)}
    {Array.from({ length: 2 }, (_, index) => <i key={`rain-${index}`} className={`voices-rain voices-rain-${index}`} />)}
    <i className="voices-meteor voices-meteor-0" />
  </div>;
}

function FeedbackViewer({ feedback, index, language, onClose, onPrevious, onNext, closeRef }: {
  feedback: StudentFeedback;
  index: number;
  language: Language;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const copy = voicesPageCopy[language];
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !viewerRef.current) return;
      const focusable = Array.from(viewerRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", trapFocus);
    return () => window.removeEventListener("keydown", trapFocus);
  }, [closeRef]);

  return <section className="voices-viewer" role="dialog" aria-modal="true" aria-label={`${copy.voice} ${index + 1}`}>
    <div className="voices-viewer-backdrop" onClick={onClose} aria-hidden="true" />
    <div className={`voices-viewer-content voices-viewer-${feedback.accent}`} ref={viewerRef}>
      <button className="voices-viewer-close" type="button" onClick={onClose} ref={closeRef} aria-label={copy.close}>×</button>
      <button className="voices-viewer-nav voices-viewer-previous" type="button" onClick={onPrevious} aria-label={copy.previous}>←</button>
      <figure className="voices-photo-frame">
        <div className="voices-photo-paper"><img src={feedback.imageSrc} alt={feedback.imageAlt[language]} fetchPriority="high" /></div>
        <figcaption><span>{copy.archive} · {String(index + 1).padStart(2, "0")}</span>{feedback.grade && <strong>{feedback.grade[language]}</strong>}</figcaption>
      </figure>
      <button className="voices-viewer-nav voices-viewer-next" type="button" onClick={onNext} aria-label={copy.next}>→</button>
    </div>
  </section>;
}

export function VoicesPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [languageReady, setLanguageReady] = useState(false);
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => new Set());
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [openingFeedbackId, setOpeningFeedbackId] = useState<string | null>(null);
  const [showEntryFlash, setShowEntryFlash] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openingTimerRef = useRef<number | null>(null);
  const selectedIndex = Math.max(0, feedbacks.findIndex((feedback) => feedback.id === selectedFeedbackId));
  const selectedFeedback = selectedFeedbackId ? feedbacks[selectedIndex] : null;
  const viewedCount = feedbacks.reduce((count, feedback) => count + Number(viewedIds.has(feedback.id)), 0);
  const nextUnreadIndex = feedbacks.findIndex((feedback) => !viewedIds.has(feedback.id));
  const guideIndex = nextUnreadIndex === -1 ? 0 : nextUnreadIndex;
  const guideFeedback = feedbacks[guideIndex];
  const allViewed = viewedCount === feedbacks.length;

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    setLanguage(saved === "zh" || saved === "en" ? saved : "en");
    setViewedIds(readViewedFeedbackIds());
    setLanguageReady(true);
  }, []);
  useEffect(() => {
    if (!languageReady) return;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, languageReady]);
  useEffect(() => {
    if (window.sessionStorage.getItem("metc-voices-entry") !== "flash") return;
    window.sessionStorage.removeItem("metc-voices-entry");
    setShowEntryFlash(true);
    const timer = window.setTimeout(() => setShowEntryFlash(false), 220);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => () => {
    if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
  }, []);
  useEffect(() => {
    if (!selectedFeedback) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); goToFeedback(selectedIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); goToFeedback(selectedIndex + 1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedFeedback, selectedIndex]);

  function markViewed(id: string) {
    setViewedIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      writeViewedFeedbackIds(next);
      return next;
    });
  }
  function openFeedback(feedback: StudentFeedback, trigger: HTMLButtonElement) {
    if (openingTimerRef.current !== null) return;
    triggerRef.current = trigger;
    if (viewedIds.has(feedback.id)) {
      setSelectedFeedbackId(feedback.id);
      return;
    }
    setOpeningFeedbackId(feedback.id);
    const openingDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520;
    openingTimerRef.current = window.setTimeout(() => {
      markViewed(feedback.id);
      setSelectedFeedbackId(feedback.id);
      setOpeningFeedbackId(null);
      openingTimerRef.current = null;
    }, openingDuration);
  }
  function goToFeedback(index: number) {
    const wrapped = (index + feedbacks.length) % feedbacks.length;
    const next = feedbacks[wrapped];
    markViewed(next.id);
    setSelectedFeedbackId(next.id);
  }
  function closeViewer() {
    setSelectedFeedbackId(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }
  function resetViewed() {
    clearViewedFeedbackIds();
    setViewedIds(new Set());
  }

  const copy = voicesPageCopy[language];
  return <>
    {showEntryFlash && <div className="teaching-entry-flash" aria-hidden="true" />}
    <SiteHeader language={language} onToggleLanguage={() => setLanguage((current) => current === "zh" ? "en" : "zh")} variant="secondary" activePage="voices" />
    <main className={`voices-page${selectedFeedback ? " voices-viewer-is-open" : ""}`}>
      <section className="voices-sea" aria-labelledby="voices-title">
        <DecorativeStars />
        <VoicesWeather />
        <div className="voices-intro">
          <p className="voices-eyebrow">{copy.eyebrow}</p>
          <h1 id="voices-title">{copy.title}</h1>
          <p>{copy.body}</p>
          <div className="voices-guide">
            <div className="voices-guide-copy">
              <span className="voices-guide-kicker">{copy.guideKicker}</span>
              <strong>{copy.guideTitle}</strong>
              <span>{copy.guideBody}</span>
            </div>
            <div className="voices-guide-actions">
              <button type="button" onClick={(event) => openFeedback(guideFeedback, event.currentTarget)}>
                <i className="voices-guide-envelope" aria-hidden="true" />
                <span>{allViewed ? copy.revisit : viewedCount === 0 ? copy.start : copy.continue}</span>
                <b aria-hidden="true">→</b>
              </button>
              <span className="voices-progress" aria-live="polite"><strong>{viewedCount}</strong> / {feedbacks.length} {copy.explored}</span>
            </div>
          </div>
          <div className="voices-legend" aria-label={`${copy.unopened}; ${copy.visited}`}><span><i className="legend-envelope legend-envelope-sealed" aria-hidden="true" />{copy.unopened}</span><span><i className="legend-envelope legend-envelope-opened" aria-hidden="true" />{copy.visited}</span>{viewedCount > 0 && <button type="button" onClick={resetViewed} aria-label={copy.resetAria}>{copy.reset}</button>}</div>
        </div>
        <div className="feedback-sea" aria-label={copy.archive}>
          {feedbacks.map((feedback, index) => <FeedbackNode key={feedback.id} feedback={feedback} index={index} total={feedbacks.length} language={language} viewed={viewedIds.has(feedback.id)} guided={index === nextUnreadIndex} opening={feedback.id === openingFeedbackId} onOpen={openFeedback} />)}
        </div>
        <p className="voices-sea-note" aria-hidden="true">METC · {copy.archive}</p>
      </section>
    </main>
    <SiteFooter language={language} />
    {selectedFeedback && <FeedbackViewer feedback={selectedFeedback} index={selectedIndex} language={language} onClose={closeViewer} onPrevious={() => goToFeedback(selectedIndex - 1)} onNext={() => goToFeedback(selectedIndex + 1)} closeRef={closeRef} />}
  </>;
}
