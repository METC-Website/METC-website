#!/usr/bin/env node

import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const publicDirectory = path.join(repositoryRoot, "public/images/contact");
const manifestPath = path.join(repositoryRoot, "src/data/resources/generated/contact-qr.json");
const defaultValidDays = 7;
const shanghaiOffset = "+08:00";
const maximumImageBytes = 10 * 1024 * 1024;
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function usage() {
  console.log(`Usage:
  pnpm contact:qr -- <image>
  pnpm contact:qr -- <image> --valid-days <days>
  pnpm contact:qr -- <image> --expires-on <YYYY-MM-DD>
  pnpm contact:qr -- <image> --expires-at <ISO-8601 timestamp with timezone>

The default validity period is ${defaultValidDays} days. Calendar dates are inclusive and use Asia/Shanghai time.`);
}

function parseArguments(rawArguments) {
  const argumentsList = rawArguments[0] === "--" ? rawArguments.slice(1) : [...rawArguments];
  if (!argumentsList.length || argumentsList.includes("--help")) {
    usage();
    process.exit(argumentsList.includes("--help") ? 0 : 1);
  }

  const image = argumentsList.shift();
  const options = new Map();
  while (argumentsList.length) {
    const option = argumentsList.shift();
    if (!option?.startsWith("--")) throw new Error(`Unexpected argument: ${option}`);
    if (!argumentsList.length || argumentsList[0].startsWith("--")) throw new Error(`Missing value for ${option}`);
    if (options.has(option)) throw new Error(`Duplicate option: ${option}`);
    options.set(option, argumentsList.shift());
  }

  const allowedOptions = new Set(["--valid-days", "--expires-on", "--expires-at"]);
  for (const option of options.keys()) {
    if (!allowedOptions.has(option)) throw new Error(`Unknown option: ${option}`);
  }
  if (options.size > 1) throw new Error("Use only one expiry option.");
  return { image, options };
}

function resolveExpiry(options, now = new Date()) {
  if (options.has("--expires-on")) {
    const calendarDate = options.get("--expires-on");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(calendarDate)) throw new Error("--expires-on must use YYYY-MM-DD.");
    const [year, month, day] = calendarDate.split("-").map(Number);
    const validatedDate = new Date(Date.UTC(year, month - 1, day));
    if (validatedDate.getUTCFullYear() !== year || validatedDate.getUTCMonth() !== month - 1 || validatedDate.getUTCDate() !== day) {
      throw new Error(`Invalid calendar date: ${calendarDate}`);
    }
    const expiresAt = new Date(`${calendarDate}T23:59:59.999${shanghaiOffset}`);
    return expiresAt;
  }

  if (options.has("--expires-at")) {
    const timestamp = options.get("--expires-at");
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp)) {
      throw new Error("--expires-at must include a timezone, such as +08:00 or Z.");
    }
    const expiresAt = new Date(timestamp);
    if (!Number.isFinite(expiresAt.getTime())) throw new Error(`Invalid expiry timestamp: ${timestamp}`);
    return expiresAt;
  }

  const validDaysValue = options.get("--valid-days") ?? String(defaultValidDays);
  const validDays = Number(validDaysValue);
  if (!Number.isInteger(validDays) || validDays < 1 || validDays > 365) {
    throw new Error("--valid-days must be a whole number from 1 to 365.");
  }
  return new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000);
}

function validateImageSignature(bytes, extension) {
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if ((extension === ".jpg" && !isJpeg) || (extension === ".png" && !isPng) || (extension === ".webp" && !isWebp)) {
    throw new Error(`Image contents do not match the ${extension} extension.`);
  }
}

async function updateContactQr() {
  const { image, options } = parseArguments(process.argv.slice(2));
  const sourcePath = path.resolve(image);
  const sourceStats = await stat(sourcePath);
  if (!sourceStats.isFile()) throw new Error(`QR image is not a regular file: ${sourcePath}`);
  if (sourceStats.size === 0 || sourceStats.size > maximumImageBytes) {
    throw new Error("QR image must be between 1 byte and 10 MB.");
  }

  const sourceExtension = path.extname(sourcePath).toLowerCase();
  if (!supportedExtensions.has(sourceExtension)) throw new Error("QR image must be JPG, PNG, or WebP.");
  const outputExtension = sourceExtension === ".jpeg" ? ".jpg" : sourceExtension;
  const imageBytes = await readFile(sourcePath);
  validateImageSignature(imageBytes, outputExtension);

  const now = new Date();
  const expiresAt = resolveExpiry(options, now);
  if (expiresAt.getTime() <= now.getTime()) throw new Error("The QR expiry must be in the future.");

  await mkdir(publicDirectory, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });
  for (const extension of [".jpg", ".png", ".webp"]) {
    if (extension !== outputExtension) {
      await rm(path.join(publicDirectory, `wechat-join-qr${extension}`), { force: true });
    }
  }

  const outputFilename = `wechat-join-qr${outputExtension}`;
  await copyFile(sourcePath, path.join(publicDirectory, outputFilename));
  const digest = createHash("sha256").update(imageBytes).digest("hex");
  const manifest = {
    imageSrc: `/images/contact/${outputFilename}?v=${digest.slice(0, 12)}`,
    expiresAt: expiresAt.toISOString(),
    updatedAt: now.toISOString(),
    sha256: digest,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Contact QR updated: ${outputFilename}`);
  console.log(`Expires at: ${manifest.expiresAt}`);
  console.log(`Manifest: ${path.relative(repositoryRoot, manifestPath)}`);
}

try {
  await updateContactQr();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
