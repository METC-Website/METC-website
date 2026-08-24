# METC Vercel Deployment Debug Report

## 1. Executive Summary

The confirmed root cause is `vercel.json`'s `outputDirectory: "out"` override. Vercel's `Routes Manifest Could Not Be Found` diagnostic explicitly says that Next.js projects, including static exports, must not override Output Directory. The override was introduced in `a8d6aa8`; a supplied successful Vercel build at earlier commit `b188353` had no `vercel.json` and completed normally. The minimal fix removes that property only.

## 2. Environment

| Item | Value |
|---|---|
| Repository root | `/Users/hankchen/Desktop/METC-website-clean` |
| Debug branch | `debug/vercel-deployment` |
| Commit | `080d8fb0f32e2ac0667b6c3fa33ae6ec9bd478f8` |
| OS | macOS 26.5.2, arm64 |
| Node.js | `v24.18.0` |
| pnpm | `10.33.0` |
| Corepack | `0.35.0` |
| Next.js | `16.2.10` |
| React / React DOM | `19.2.7` / `19.2.7` |
| TypeScript | `5.9.3` |
| Vercel CLI | `59.5.0` via `pnpm dlx` |

`package.json` declares `pnpm@10.33.0`. The `pnpm-lock.yaml` importer resolves exactly Next `16.2.10`, React `19.2.7`, React DOM `19.2.7`, and TypeScript `5.9.3`; `pnpm install --frozen-lockfile` succeeded unchanged.

Build command: `pnpm build` (`next build`). Output mode: `output: "export"`. `next.config.ts` has `images.unoptimized: true`. The retained Vercel overrides are framework `nextjs`, frozen pnpm install, and pnpm build; the invalid output-directory override was removed. `.vercelignore` excludes `public/resources/`, `output/`, `.playwright-cli/`, and `.env*`.

## 3. Historical Findings

- Known-good source revision verified: `522861a0260c5f07cd20cc54c8493c5cc947c30e` (`Use R2 for public resources and reduce Vercel output`). Its frozen install and build pass.
- Supplied Vercel log at `b188353` is an additional confirmed successful deployment: it ran `next build`, completed `/vercel/output`, and deployed successfully. This revision has no `vercel.json`.
- `a8d6aa8a14e0284da2425bdd2435bf321e81ae2b` introduced `vercel.json`, including `outputDirectory: "out"`.
- `080d8fb` is the current revision. Its only change is removing `resources/` from `.vercelignore`; it is not a locally reproducible build regression.
- The prior GitHub-organization-private-repository/Hobby-plan blocker is historical only. Repository accessibility and Vercel account policy cannot be inspected without an authenticated Vercel project.
- The former `public/resources -> ../resources` symlink is not present. In the commit tree and working tree, `public/resources/**` is a regular-file tree (mode `100644`) that is deliberately excluded from Vercel uploads.

The output-directory deployment regression was introduced by `a8d6aa8`. Local Next builds continue to pass because the erroneous setting is consumed by Vercel's deployment adapter, not by `next build`.

| Commit | Result | First error |
|---|---|---|
| `522861a0260c5f07cd20cc54c8493c5cc947c30e` | PASS | — |
| `b188353` | PASS on Vercel | Deployment completed |
| `a8d6aa8a14e0284da2425bdd2435bf321e81ae2b` | FAIL (configuration introduced) | `outputDirectory: "out"` added |
| `080d8fb0f32e2ac0667b6c3fa33ae6ec9bd478f8` | PASS | — |

## 4. Tests Performed

| Test | Result | Evidence |
|---|---|---|
| Frozen install, current | PASS | `pnpm install --frozen-lockfile` completed with lockfile unchanged. |
| Typecheck, current | PASS | `next typegen && tsc --noEmit` succeeded. |
| Current Next build | PASS | Next compiled, typechecked, and exported all 7 static entries. |
| Static output | PASS | `out/index.html`, `out/teaching.html`, `out/activities.html`, and `out/voices.html` exist. Non-root routes correctly use `.html` output because `trailingSlash` is not enabled. |
| Known-good historical build | PASS | Isolated sparse worktree at `522861a` built successfully. |
| Static-export audit | PASS | No dynamic route folders, server actions, route handlers, middleware, request APIs, ISR/dynamic settings, or `next/image` usage were found. |
| Resource-manifest audit | PASS | `albums.json`, `courses.json`, `feedbacks.json`, and `contact-qr.json` are tracked and imported from `src/data/resources/generated/`. |
| Resource payload audit | PASS | `public/resources/**` holds 412 tracked files / 486.6 MiB and is excluded. The non-resource tracked payload is 3.36 MiB. |
| R2 output audit | PASS | Emitted HTML has no `/METC-website` or root `/resources/` URL; R2 host references occur in generated output. |
| Linux path audit | PASS | No source import case collisions, absolute paths, or build-time filesystem reads were found. Docker is unavailable, so a Linux container build was not run. |
| Environment audit | PASS | Public resource URL has an `https://assets.sciemetc.com` fallback; Cloudflare write credentials only occur in maintenance scripts and are not called by build. |
| Vercel dry-run, current config (A) | NOT TESTABLE | CLI stops with `No existing credentials found` before project/config/build execution. |
| Vercel dry-run, remove only outputDirectory (B) | NOT TESTABLE | Same authentication boundary. File was restored. |
| Vercel dry-run, native build/install defaults (C) | NOT TESTABLE | Same authentication boundary. File was restored. |
| Local `vercel build` | NOT TESTABLE | CLI returns `project_settings_required`: no linked project settings are present. |
| Supplied Vercel deployment log at `b188353` | PASS | Build and deployment completed; no `vercel.json` existed at that revision. |
| Supplied Vercel routes-manifest diagnostic | CONFIRMED | It identifies a Next.js Output Directory override as the applicable cause. |

Raw local logs are intentionally under ignored `output/vercel-debug/` and are not committed.

## 5. Hypothesis Matrix

| Hypothesis | Status | Evidence |
|---|---|---|
| pnpm lock mismatch | RULED OUT | Frozen install succeeds with the declared pnpm version and current lockfile. |
| TypeScript/source compilation error | RULED OUT | Typecheck and production build succeed. |
| Unsupported static-export route behavior | RULED OUT | Entire App Router route inventory is static and export succeeds. |
| Generated manifests excluded by `.vercelignore` | RULED OUT | They are tracked under `src/`; no `.vercelignore` pattern matches them. |
| Build needs `resources/` or `public/resources/` | RULED OUT | Source has no build-time filesystem access; manifests translate legacy paths to R2 URLs. |
| Old `public/resources` symlink | RULED OUT | No symlink exists in the commit tree or working tree. |
| Missing Cloudflare write credentials | RULED OUT | Build scripts do not execute R2 maintenance tools; public base URL has a safe fallback. |
| Node-version-specific build error | RULED OUT for Node 24.18.0 | Both revisions build under Node 24.18.0. Vercel's configured Node version cannot be inspected. |
| Linux case-sensitive import failure | STRONGLY SUPPORTED as ruled out | Imports and tracked source paths were audited; no mismatch or build-time path reads were found. Linux container tooling is unavailable. |
| `vercel.json` output-directory override conflicts with adapter | CONFIRMED | `a8d6aa8` introduced `outputDirectory: "out"`; Vercel's supplied routes-manifest diagnostic explicitly directs its removal for Next.js static exports. |
| Vercel project/account settings or deployment payload handling | NOT TESTABLE | No Vercel account/project linkage or deployment logs are accessible. |

## 6. Root Cause

**Classification: C — `vercel.json` override conflict.**

`output: "export"` correctly writes static files to `out/`, but Vercel's Next.js adapter still needs the normal Next build metadata, including the routes manifest. Forcing Vercel's project Output Directory to `out` makes it inspect the export directory as its Next build output; that directory does not contain `.next/routes-manifest.json`, causing the stated error.

The configuration was introduced in `a8d6aa8`, after the supplied successful `b188353` deployment. This explains why `next build` itself succeeds and why the error is Vercel-specific.

## 7. Fix

Removed only `outputDirectory: "out"` from `vercel.json`. No changes were made to Next.js, React, pnpm, static export, routes, R2 support, generated manifests, or resource exclusions.

Do not remove `output: "export"`, change package versions, or alter the R2 architecture.

## 8. Final Verification

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS |
| `test -d out` and `test -f out/index.html` | PASS |
| `/`, `/teaching`, `/activities`, `/voices` static files | PASS |
| `/METC-website` in emitted HTML | PASS (none) |
| `assets.sciemetc.com` in emitted output | PASS |
| Vercel dry-run | NOT TESTABLE (authentication required) |
| Preview deployment | NOT RUN |

## 9. Recommended Vercel Project Settings

Use one canonical production project connected to this repository and production branch `main`. The existing project settings cannot be read here, so confirm them before editing.

| Setting | Recommended value | Default or override |
|---|---|---|
| Framework Preset | Next.js | Vercel detection/default |
| Root Directory | `.` | Vercel default |
| Node.js Version | 24.x | Explicitly pin after confirming the project supports Node 24; this matches the validated local build. |
| Package Manager | pnpm 10.33.0 | Derived from `packageManager`; no separate npm configuration. |
| Install Command | `pnpm install --frozen-lockfile` | Explicit current override is valid. |
| Build Command | `pnpm build` | Native Next.js default; current explicit override is equivalent. |
| Output Directory | Not configured | Vercel default; never override for this Next.js static export. |
| Production Branch | `main` | Explicit dashboard setting |

## 10. Remaining Manual Actions

1. In the Vercel dashboard, clear any **Output Directory** field as well. Dashboard configuration can override repository intent.
2. Redeploy a preview from this branch and confirm it passes the routes-manifest stage. Do not deploy production without explicit authorization.
3. If multiple Vercel projects are connected, select one canonical `main` production project and disconnect/archive duplicates only after verifying their domains and production-branch settings.
