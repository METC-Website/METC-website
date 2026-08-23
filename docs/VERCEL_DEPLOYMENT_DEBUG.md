# METC Vercel Deployment Debug Report

## 1. Executive Summary

No repository-level Vercel build failure was reproduced at commit `080d8fb0f32e2ac0667b6c3fa33ae6ec9bd478f8`. The locked install, typecheck, Next static export, historical comparison, and resource-manifest audit all pass. The Vercel CLI in this environment has no authenticated account or linked project, so each dry-run stops before Vercel reads project settings, packages files, or invokes the Next.js adapter; the current remote deployment failure cannot be identified from source-only evidence.

No deployment configuration was changed: doing so would be speculative and violate the debugging constraints.

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

Build command: `pnpm build` (`next build`). Output mode: `output: "export"`. `next.config.ts` has `images.unoptimized: true`. Current Vercel overrides are framework `nextjs`, frozen pnpm install, pnpm build, and output directory `out`. `.vercelignore` excludes `public/resources/`, `output/`, `.playwright-cli/`, and `.env*`.

## 3. Historical Findings

- Known-good source revision verified: `522861a0260c5f07cd20cc54c8493c5cc947c30e` (`Use R2 for public resources and reduce Vercel output`). Its frozen install and build pass.
- `080d8fb` is the current revision. Its only change is removing `resources/` from `.vercelignore`; it is not a locally reproducible build regression.
- The prior GitHub-organization-private-repository/Hobby-plan blocker is historical only. Repository accessibility and Vercel account policy cannot be inspected without an authenticated Vercel project.
- The former `public/resources -> ../resources` symlink is not present. In the commit tree, `public/resources/**` is a regular-file tree (mode `100644`), and the sparse local checkout intentionally leaves it unmaterialized.

No first bad commit can be isolated: both endpoints pass the only reproducible source-build gate.

| Commit | Result | First error |
|---|---|---|
| `522861a0260c5f07cd20cc54c8493c5cc947c30e` | PASS | — |
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
| `vercel.json` output-directory override conflicts with adapter | NOT TESTABLE | A/B dry-runs cannot authenticate, so none reaches framework detection or adapter execution. |
| Vercel project/account settings or deployment payload handling | NOT TESTABLE | No Vercel account/project linkage or deployment logs are accessible. |

## 6. Root Cause

**Classification: N — other: the remote Vercel-side failure is not observable from this workspace.**

The actual failing phase, error text, Vercel project, and build environment have not been supplied and cannot be queried anonymously. Every source-level phase Vercel would run before project-specific adapter/deployment handling passes locally. Therefore no code, dependency, resource-architecture, or `vercel.json` root cause is confirmed.

The next required evidence is the failed deployment's build log and the settings of the single canonical Vercel project. This is necessary to distinguish account/project policy, adapter/output handling, and a Vercel-Node-version difference.

## 7. Fix

No production fix was applied because no root cause was confirmed. The sole committed change is this diagnostic report.

Do not remove `output: "export"`, change package versions, alter R2, or simplify `vercel.json` until an authenticated A/B dry-run or preview demonstrates a specific failure and fix.

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
| Output Directory | `out` only if authenticated Test A confirms it is accepted | Do not change this setting based on this report alone. Test B must first demonstrate that removing it fixes a real Vercel error. |
| Production Branch | `main` | Explicit dashboard setting |

## 10. Remaining Manual Actions

1. Log in to the Vercel account that owns the intended project, or run the diagnostic commands in an existing linked checkout. Do not provide a token in chat.
2. Capture the complete failed deployment build log, deployment URL/ID, project name, team, Node version, and non-secret environment-variable names.
3. Run the already-defined A/B sequence on that exact project: current config, remove only `outputDirectory`, then remove build/install overrides. Compare framework detection, install/build command, included files, and adapter output.
4. If multiple Vercel projects are connected, select one canonical `main` production project and disconnect/archive duplicates only after verifying their domains and production-branch settings.
5. Run a preview deployment after a confirmed fix; do not deploy production without explicit authorization.
