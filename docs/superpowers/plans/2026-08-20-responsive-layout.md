# METC Responsive Layout Implementation Plan

> 历史实施记录：用于追溯当时任务，不代表当前待办或资源架构；现行实现以代码、README 与运维文档为准。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add phone and tablet layouts for the homepage, teaching, activities, and voices pages while preserving the desktop layout from baseline commit `522861a`.

**Architecture:** Keep the existing page components and resource model. Add scoped responsive CSS in the four existing page stylesheets, using `max-width: 760px` for phones and `min-width: 761px` through `max-width: 1100px` for tablets; make only minimal JSX changes where a layout needs a semantic wrapper or a stable responsive class. Validate with typecheck, static export build, CSS overflow checks, and a desktop regression comparison against `522861a`.

**Tech Stack:** Next.js static export, React, TypeScript, plain CSS media queries, pnpm.

---

## Files and responsibilities

- Modify `app/homepage.css`: shared header, homepage hero, section grids, buttons, photos, dialogs, and footer responsive rules.
- Modify `app/teaching.css`: teaching hero, course shelves/books, resource previews, PPT viewer and syllabus layout.
- Modify `app/activities.css`: gallery hero, album shelf, scrapbook grid, expanded album and photo lightbox.
- Modify `app/voices.css`: feedback sea, nodes, legend, viewer and mobile/tablet touch targets.
- Modify JSX only if inspection shows a missing wrapper/class prevents a CSS-only solution; keep changes limited to existing components under `components/homepage/`, `components/teaching/`, `components/activities/`, and `components/voices/`.
- Do not modify `lib/site-path.ts`, `src/data/resources/`, `next.config.ts`, R2 URLs, or desktop base rules unless a regression requires a narrowly scoped fix.

### Task 1: Establish the responsive CSS foundation

**Files:** `app/homepage.css`, `app/globals.css` (only if required for a global overflow/accessibility rule).

- [ ] Step 1: Record the baseline selectors and current breakpoint behavior from commit `522861a`, including existing `min-width: 761px`, `max-width: 1020px`, `max-width: 1180px`, `max-width: 920px`, and `max-width: 700px` blocks; do not alter desktop base rules.
- [ ] Step 2: Add a final responsive override section with explicit phone (`max-width: 760px`) and tablet (`min-width: 761px` through `max-width: 1100px`) scopes, overriding any inherited 761/920/1020/1180 layout rule that causes tablet overflow.
- [ ] Step 3: Add only safe shared rules: `min-width: 0` on grid/flex children, `max-width: 100%` for media, safe-area padding for fixed overlays, and page-level overflow containment without disabling the navigation bar's own scrolling.
- [ ] Step 4: Run `pnpm typecheck` to catch accidental syntax or selector-related JSX edits before page-specific work.
- [ ] Step 5: Commit: `git add app/homepage.css app/globals.css && git commit -m "style: add responsive layout foundation"`.

### Task 2: Adapt the homepage for phone and tablet

**Files:** `app/homepage.css`, and only if required the existing homepage components under `components/homepage/`.

- [ ] Step 1: Make the phone header a two-row layout: brand/language row plus a horizontally scrollable nav row; preserve accessible link/button targets with at least 44px vertical touch area.
- [ ] Step 2: Make the phone hero single-column, hide only decorative illustrations that compete with copy, and keep the logo, title, paragraph, and CTA inside the viewport.
- [ ] Step 3: Make homepage section intros, mission spread, teaching manual, classroom photo, activity actions, voice margins, dialogs, and footer single-column or full-width where appropriate; keep tablet two-column content where it remains readable.
- [ ] Step 4: Add tablet-specific width/gap rules for the hero and section grids so 768–1100px devices do not inherit desktop widths that overflow.
- [ ] Step 5: Run `pnpm typecheck` and `pnpm build`; inspect generated route list and confirm no resource-path changes.
- [ ] Step 6: Commit: `git add app/homepage.css components/homepage && git commit -m "style: adapt homepage for phone and tablet"` (omit `components/homepage` if untouched).

### Task 3: Adapt the teaching page

**Files:** `app/teaching.css`, existing teaching components only if a class/wrapper is required.

- [ ] Step 1: Stack teaching hero copy and controls on phones; constrain decorative sketches so they cannot cover the title.
- [ ] Step 2: Make course shelf/books and library intro shrink with `minmax(0, 1fr)`; use a single readable column for phones and a two-column tablet layout.
- [ ] Step 3: Make syllabus HTML, PDF links, PPT archive, image stage and thumbnails width-safe; allow resource action labels to wrap.
- [ ] Step 4: Adapt PPT modal/viewer controls to safe-area padding and at least 44px touch targets on phone/tablet.
- [ ] Step 5: Run `pnpm typecheck` and `pnpm build`; verify `/teaching` remains a static route and R2 resource URLs are unchanged.
- [ ] Step 6: Commit: `git add app/teaching.css components/teaching && git commit -m "style: adapt teaching page for phone and tablet"` (omit component paths if untouched).

### Task 4: Adapt the activities page

**Files:** `app/activities.css`, existing activities components only if a class/wrapper is required.

- [ ] Step 1: Use a single-column album shelf for phones and a two-column shelf for tablets; prevent album covers from forcing a minimum viewport width.
- [ ] Step 2: Keep the scrapbook grid at two columns on phones and three columns on tablets, preserving each source image's aspect ratio and preventing horizontal overflow.
- [ ] Step 3: Make expanded albums full-width on phones and near-full-width on tablets; ensure close/back controls remain reachable below the safe area.
- [ ] Step 4: Make the photo lightbox fill the phone viewport and keep previous/next/close controls at least 44px with readable captions.
- [ ] Step 5: Run `pnpm typecheck` and `pnpm build`; verify `/activities` and representative R2 image URLs remain valid.
- [ ] Step 6: Commit: `git add app/activities.css components/activities && git commit -m "style: adapt activities page for phone and tablet"` (omit component paths if untouched).

### Task 5: Adapt the voices page

**Files:** `app/voices.css`, existing voices components only if a class/wrapper is required.

- [ ] Step 1: Reposition and scale feedback nodes for phone widths so nodes and legend do not overlap; retain the decorative atmosphere without blocking interaction. Keep node and viewer controls at least 44px; do not retain the existing 34px mobile viewer buttons.
- [ ] Step 2: Define a tablet node field with relative sizing and a centered intro/legend; keep the existing desktop composition above 1100px.
- [ ] Step 3: Make the voices viewer full-screen on phones and 92vw-or-less on tablets, with safe-area close/navigation controls and readable captions.
- [ ] Step 4: Respect reduced-motion behavior for any new transitions or layout changes.
- [ ] Step 5: Run `pnpm typecheck` and `pnpm build`; verify `/voices` remains a static route.
- [ ] Step 6: Commit: `git add app/voices.css components/voices && git commit -m "style: adapt voices page for phone and tablet"` (omit component paths if untouched).

### Task 6: Cross-page verification and desktop regression

**Files:** no production files unless verification finds a defect; local screenshots/notes must stay untracked.

- [ ] Step 1: Run `pnpm typecheck` and `pnpm build` from the repository root and record exit code/output.
- [ ] Step 2: Run a static overflow audit for all final CSS files and confirm the responsive media queries are present at 760px/761–1100px without malformed blocks.
- [ ] Step 3: Check the generated static output for `/`, `/teaching`, `/activities`, and `/voices`; confirm `out/` does not contain the removed 900MB resource tree and representative R2 URLs remain in generated HTML/data.
- [ ] Step 4: Compare the four pages at 1101×800, 1280×800, and 1440×900 against baseline commit `522861a`; record that desktop layout, typography, navigation, and interactions remain unchanged.
- [ ] Step 5: Validate each of `/`, `/teaching`, `/activities`, and `/voices` at every responsive acceptance size: 360×800, 390×844, 430×932, 768×1024, 820×1180, 1024×768, and 1100×800. Open each page's relevant state (homepage dialogs, course PPT/syllabus viewer, activity album/lightbox, voices viewer) and verify controls, content, and resources; the page root must satisfy `document.documentElement.scrollWidth <= window.innerWidth`, only the navigation strip may scroll horizontally, feedback nodes must not overlap the legend, and all touch controls must be at least 44px.
- [ ] Step 6: Review `git diff 522861a...HEAD`, remove build artifacts, and report any unresolved visual limitation instead of claiming completion.
