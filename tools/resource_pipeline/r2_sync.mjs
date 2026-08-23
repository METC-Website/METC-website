#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { lstat, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const localEnvironmentPath = path.join(repositoryRoot, ".env.worker.local");
const manifestPath = path.join(repositoryRoot, "src/data/resources/generated/feedbacks.json");
const albumManifestPath = path.join(repositoryRoot, "src/data/resources/generated/albums.json");
const courseManifestPath = path.join(repositoryRoot, "src/data/resources/generated/courses.json");
const metcRoot = path.resolve(process.env.METC_RESOURCE_ROOT || path.join(repositoryRoot, "resources/METC"));
const publicBaseUrl = (process.env.NEXT_PUBLIC_RESOURCE_BASE_URL || "https://assets.sciemetc.com").replace(/\/+$/, "");
const workerBaseUrl = (process.env.R2_WORKER_UPLOAD_URL || "https://upload.sciemetc.com").replace(/\/+$/, "");
const requiredCredentials = ["CF_ACCESS_CLIENT_ID", "CF_ACCESS_CLIENT_SECRET"];
const minimumPublicMaxAgeSeconds = 86400;
const maximumUploadBytes = 100 * 1024 * 1024;
const accessProbeObjectKey = "resources/METC/课程设计/经济-宏观/demonstration/syllabus.zh.html";
const contentTypesByExtension = new Map([
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
]);
const allowedContentTypes = new Set(contentTypesByExtension.values());

function usage() {
  console.log(`Usage:
  pnpm r2:check
  pnpm r2:verify-write
  pnpm r2:verify-object -- <resources/object-key> <content-type>
  pnpm r2:preflight -- <local-file> <resources/object-key> [content-type]
  pnpm r2:upload -- <local-file> <resources/object-key> [content-type]
  pnpm r2:preflight-feedback
  pnpm r2:upload-feedback
  pnpm r2:verify-feedback
  pnpm r2:verify-cache`);
}

function credentials() {
  const missing = requiredCredentials.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing Worker credentials: ${missing.join(", ")}`);
  }
  const clientId = process.env.CF_ACCESS_CLIENT_ID.trim();
  if (!clientId.endsWith(".access")) {
    throw new Error("CF_ACCESS_CLIENT_ID does not have the expected Access Service Token format.");
  }
  return {
    clientId,
    clientSecret: process.env.CF_ACCESS_CLIENT_SECRET.trim(),
  };
}

function accessHeaders(extra = {}) {
  const values = credentials();
  return {
    "CF-Access-Client-Id": values.clientId,
    "CF-Access-Client-Secret": values.clientSecret,
    ...extra,
  };
}

function validateServiceUrls() {
  const worker = new URL(workerBaseUrl);
  const publicHost = new URL(publicBaseUrl);
  if (worker.protocol !== "https:" || worker.hostname !== "upload.sciemetc.com" || worker.port || worker.pathname !== "/" || worker.search || worker.hash || worker.username || worker.password) {
    throw new Error("R2_WORKER_UPLOAD_URL must be https://upload.sciemetc.com without a path.");
  }
  if (publicHost.protocol !== "https:" || publicHost.hostname !== "assets.sciemetc.com" || publicHost.port || publicHost.pathname !== "/" || publicHost.search || publicHost.hash || publicHost.username || publicHost.password) {
    throw new Error("NEXT_PUBLIC_RESOURCE_BASE_URL must be https://assets.sciemetc.com without a path.");
  }
}

async function validateLocalEnvironmentFile() {
  let linkStats;
  try {
    linkStats = await lstat(localEnvironmentPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new Error("Missing local .env.worker.local credential file.");
    }
    throw error;
  }
  if (!linkStats.isFile() && !linkStats.isSymbolicLink()) {
    throw new Error(".env.worker.local must be a regular file or a symlink to a protected credential file.");
  }
  const target = await realpath(localEnvironmentPath);
  const targetStats = await stat(target);
  if (!targetStats.isFile()) throw new Error("The .env.worker.local target is not a regular file.");
  if ((targetStats.mode & 0o077) !== 0) {
    throw new Error("The local Worker credential file must not be readable or writable by group or other users (use chmod 600).");
  }
}

function validateObjectKey(input) {
  if (!input) throw new Error("An R2 object key is required.");
  if (input !== input.normalize("NFC")) throw new Error("Object keys must use Unicode NFC normalization.");
  if (input.includes("\\") || input.includes("\0") || input.startsWith("/")) {
    throw new Error(`Unsafe Worker object key: ${input}`);
  }
  const segments = input.split("/");
  if (!input.startsWith("resources/") || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Worker object keys must stay below resources/: ${input}`);
  }
  if (segments.some((segment) => segment.toLowerCase() === "source")) {
    throw new Error(`Source material is never uploadable: ${input}`);
  }
  return input;
}

function encodedObjectUrl(baseUrl, objectKey) {
  const safeKey = validateObjectKey(objectKey);
  return `${baseUrl}/${safeKey.split("/").map(encodeURIComponent).join("/")}`;
}

function contentTypeForFile(file, explicitContentType) {
  const inferred = contentTypesByExtension.get(path.extname(file).toLowerCase());
  const contentType = explicitContentType || inferred;
  if (!contentType || !allowedContentTypes.has(contentType)) {
    throw new Error(`Unsupported or missing public content type for ${file}.`);
  }
  if (inferred && explicitContentType && explicitContentType !== inferred) {
    throw new Error(`Content type ${explicitContentType} does not match the file extension; expected ${inferred}.`);
  }
  return contentType;
}

async function validateLocalUpload(fileInput, objectKeyInput, explicitContentType) {
  if (!fileInput) throw new Error("A local display file is required.");
  const file = path.resolve(fileInput);
  const sourceSegments = file.split(path.sep).map((segment) => segment.toLowerCase());
  if (sourceSegments.includes("source")) {
    throw new Error(`Refusing to upload a file from a source/ directory: ${file}`);
  }
  const fileStats = await stat(file);
  if (!fileStats.isFile()) throw new Error(`Upload input is not a regular file: ${file}`);
  if (fileStats.size === 0) throw new Error(`Upload input is empty: ${file}`);
  if (fileStats.size > maximumUploadBytes) {
    throw new Error(`Upload input exceeds the Worker 100 MB limit: ${fileStats.size} bytes.`);
  }
  const objectKey = validateObjectKey(objectKeyInput);
  const contentType = contentTypeForFile(file, explicitContentType);
  return { file, objectKey, contentType, size: fileStats.size };
}

function isExpectedContentType(actual, expected) {
  if (!actual) return false;
  const normalize = (value) => {
    const [mediaType, ...parameters] = value.toLowerCase().split(";").map((part) => part.trim()).filter(Boolean);
    return [mediaType, ...parameters.sort()].join(";");
  };
  return normalize(actual) === normalize(expected);
}

async function fetchReadWithRetry(url, init = {}, timeoutMilliseconds = 30000) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMilliseconds),
      });
      if (response.status < 500 || attempt === 3) return response;
      await response.body?.cancel();
      lastError = new Error(`Read request returned HTTP ${response.status}.`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
  throw new Error(`Read request failed after three attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function authenticatedWorkerGet(objectKey) {
  const response = await fetchReadWithRetry(encodedObjectUrl(workerBaseUrl, objectKey), {
    method: "GET",
    headers: accessHeaders(),
    redirect: "manual",
  });
  await response.body?.cancel();
  if (!response.ok) {
    throw new Error(`Cloudflare Access or Worker read check failed with HTTP ${response.status}.`);
  }
  return response;
}

async function checkAccess() {
  await validateLocalEnvironmentFile();
  validateServiceUrls();
  await authenticatedWorkerGet(accessProbeObjectKey);
  console.log("Worker access confirmed with an authenticated read.");
}

async function uploadBuffer(body, objectKey, contentType) {
  const response = await fetch(encodedObjectUrl(workerBaseUrl, objectKey), {
    method: "PUT",
    headers: accessHeaders({
      "Content-Type": contentType,
    }),
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(120000),
  });
  await response.body?.cancel();
  if (response.status !== 201) {
    throw new Error(`Worker upload failed with HTTP ${response.status} for ${objectKey}.`);
  }
}

async function verifyUploadedObject(objectKey, contentType) {
  const authenticatedResponse = await authenticatedWorkerGet(objectKey);
  if (!isExpectedContentType(authenticatedResponse.headers.get("content-type"), contentType)) {
    throw new Error(`Worker read returned an unexpected Content-Type for ${objectKey}.`);
  }
  if (!hasReusablePublicCache(authenticatedResponse.headers.get("cache-control"))) {
    throw new Error(`Worker read returned an unexpected Cache-Control for ${objectKey}.`);
  }
  const publicResponse = await fetchReadWithRetry(encodedObjectUrl(publicBaseUrl, objectKey), {
    method: "HEAD",
    redirect: "follow",
  });
  if (!publicResponse.ok || !isExpectedContentType(publicResponse.headers.get("content-type"), contentType) || !hasReusablePublicCache(publicResponse.headers.get("cache-control"))) {
    throw new Error(`Public verification failed with HTTP ${publicResponse.status} for ${objectKey}.`);
  }
}

async function verifyObjectCommand(objectKey, contentType) {
  await validateLocalEnvironmentFile();
  validateServiceUrls();
  credentials();
  validateObjectKey(objectKey);
  if (!allowedContentTypes.has(contentType)) throw new Error(`Unsupported expected content type: ${contentType}`);
  await verifyUploadedObject(objectKey, contentType);
  console.log(`Worker and public object verification passed: ${objectKey}`);
}

async function preflightUpload(fileInput, objectKeyInput, explicitContentType, { checkWorker = true } = {}) {
  await validateLocalEnvironmentFile();
  validateServiceUrls();
  credentials();
  const upload = await validateLocalUpload(fileInput, objectKeyInput, explicitContentType);
  if (checkWorker) await authenticatedWorkerGet(accessProbeObjectKey);
  console.log(`Preflight passed: ${upload.objectKey} (${upload.size} bytes, ${upload.contentType})`);
  return upload;
}

async function uploadFile(fileInput, objectKeyInput, explicitContentType) {
  const upload = await preflightUpload(fileInput, objectKeyInput, explicitContentType);
  const body = await readFile(upload.file);
  await uploadBuffer(body, upload.objectKey, upload.contentType);
  await verifyUploadedObject(upload.objectKey, upload.contentType);
  console.log(`Worker upload and public verification passed: ${upload.objectKey}`);
}

async function verifyWrite() {
  await validateLocalEnvironmentFile();
  validateServiceUrls();
  credentials();
  await authenticatedWorkerGet(accessProbeObjectKey);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const objectKey = `resources/_admin-test/worker-uploader-${timestamp}-${randomUUID()}.txt`;
  const contentType = "text/plain; charset=utf-8";
  const body = Buffer.from("METC Worker uploader verification\n", "utf8");
  await uploadBuffer(body, objectKey, contentType);
  await verifyUploadedObject(objectKey, contentType);
  console.log(`Worker write and public read confirmed: ${objectKey}`);
  console.log("The verification object was retained because deletion requires an explicit object key and user approval.");
}

async function feedbackManifest() {
  return JSON.parse(await readFile(manifestPath, "utf8"));
}

function objectKeyFromResourcePath(resourcePath) {
  const pathname = new URL(resourcePath, "https://resources.invalid").pathname
    .replace(/^\/METC-website\//, "/")
    .replace(/^\/+/, "");
  const objectKey = decodeURIComponent(pathname);
  if (!objectKey.startsWith("resources/METC/") || objectKey.includes("..")) {
    throw new Error(`Unsafe public resource path: ${resourcePath}`);
  }
  return validateObjectKey(objectKey);
}

function localPathForObject(objectKey) {
  const prefix = "resources/METC/";
  const safeKey = validateObjectKey(objectKey);
  if (!safeKey.startsWith(prefix)) {
    throw new Error(`Unsafe Student Voice object key: ${objectKey}`);
  }
  return path.join(metcRoot, safeKey.slice(prefix.length));
}

async function feedbackUploads({ checkWorker = true } = {}) {
  const entries = await feedbackManifest();
  if (!entries.length) throw new Error("Student Voice manifest is empty; generate it before uploading.");
  const uploads = [];
  for (const entry of entries) {
    if (!entry.objectKey?.startsWith("resources/METC/听ta们说/demonstration/")) {
      throw new Error(`Unsafe Student Voice manifest object key: ${entry.objectKey}`);
    }
    uploads.push(await preflightUpload(localPathForObject(entry.objectKey), entry.objectKey, "image/webp", { checkWorker: false }));
  }
  if (checkWorker) await authenticatedWorkerGet(accessProbeObjectKey);
  return uploads;
}

async function preflightFeedback() {
  const uploads = await feedbackUploads();
  console.log(`Student Voice preflight passed for ${uploads.length} object(s).`);
}

async function uploadFeedback() {
  const uploads = await feedbackUploads();
  for (const upload of uploads) {
    await uploadBuffer(await readFile(upload.file), upload.objectKey, upload.contentType);
    await verifyUploadedObject(upload.objectKey, upload.contentType);
    console.log(`Uploaded and verified ${upload.objectKey}`);
  }
}

async function publicResourceEntries() {
  const [feedbackEntries, albums, courses] = await Promise.all([
    feedbackManifest(),
    readFile(albumManifestPath, "utf8").then(JSON.parse),
    readFile(courseManifestPath, "utf8").then(JSON.parse),
  ]);
  const entries = [
    ...feedbackEntries.map((entry) => ({ type: "student-feedback", objectKey: validateObjectKey(entry.objectKey) })),
    ...albums.flatMap((album) => album.photos.map((photo) => ({ type: "activity-photo", objectKey: objectKeyFromResourcePath(photo.src) }))),
    ...courses.flatMap((course) => [
      ...Object.values(course.syllabus || {}).filter(Boolean).map((resourcePath) => ({ type: "syllabus", objectKey: objectKeyFromResourcePath(resourcePath) })),
      ...Object.values(course.syllabusAssets || {}).flat().filter(Boolean).map((resourcePath) => ({ type: "syllabus-asset", objectKey: objectKeyFromResourcePath(resourcePath) })),
    ]),
  ];
  return [...new Map(entries.map((entry) => [entry.objectKey, entry])).values()];
}

function hasReusablePublicCache(cacheControl) {
  if (!cacheControl) return false;
  const directives = cacheControl.toLowerCase().split(",").map((value) => value.trim());
  const maxAge = directives.find((value) => value.startsWith("max-age="))?.split("=")[1];
  return directives.includes("public") && Number(maxAge) >= minimumPublicMaxAgeSeconds;
}

async function verifyPublic() {
  const entries = await feedbackManifest();
  if (!entries.length) throw new Error("Student Voice manifest is empty; there are no public objects to verify.");
  const failures = [];
  for (const entry of entries) {
    const response = await fetchReadWithRetry(encodedObjectUrl(publicBaseUrl, validateObjectKey(entry.objectKey)), { method: "HEAD", redirect: "follow" });
    if (!response.ok || response.headers.get("content-type") !== "image/webp") {
      failures.push({ objectKey: entry.objectKey, status: response.status, contentType: response.headers.get("content-type") });
    }
  }
  if (failures.length) throw new Error(`Public Student Voice verification failed:\n${JSON.stringify(failures, null, 2)}`);
  console.log(`Verified ${entries.length} public Student Voice WebP object(s).`);
}

async function verifyCache() {
  const entries = await publicResourceEntries();
  const failures = [];
  let next = 0;
  async function worker() {
    while (next < entries.length) {
      const entry = entries[next++];
      try {
        const response = await fetchReadWithRetry(encodedObjectUrl(publicBaseUrl, entry.objectKey), { method: "HEAD", redirect: "follow" });
        const cacheControl = response.headers.get("cache-control");
        if (!response.ok || !hasReusablePublicCache(cacheControl)) {
          failures.push({ type: entry.type, objectKey: entry.objectKey, status: response.status, cacheControl });
        }
      } catch (error) {
        failures.push({ type: entry.type, objectKey: entry.objectKey, status: 0, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, entries.length) }, worker));
  if (failures.length) {
    throw new Error(`Public cache verification failed for ${failures.length}/${entries.length} object(s):\n${JSON.stringify(failures.slice(0, 10), null, 2)}`);
  }
  console.log(`Verified at least 24 hours of public browser caching for ${entries.length} public R2 object(s).`);
}

const commandArguments = process.argv.slice(2);
if (commandArguments[1] === "--") commandArguments.splice(1, 1);
const [command, firstArgument, secondArgument, thirdArgument] = commandArguments;
try {
  if (command === "--check-access") await checkAccess();
  else if (command === "--verify-write") await verifyWrite();
  else if (command === "--verify-object") await verifyObjectCommand(firstArgument, secondArgument);
  else if (command === "--preflight-upload") await preflightUpload(firstArgument, secondArgument, thirdArgument);
  else if (command === "--upload-file") await uploadFile(firstArgument, secondArgument, thirdArgument);
  else if (command === "--preflight-feedback") await preflightFeedback();
  else if (command === "--upload-feedback") await uploadFeedback();
  else if (command === "--verify-public") await verifyPublic();
  else if (command === "--verify-cache") await verifyCache();
  else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
