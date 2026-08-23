# Mobile Secondary Layout Implementation Plan

> 历史实施记录：用于追溯已完成的移动端改造，不代表当前待办或资源加载策略。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce mobile scroll length by making the teaching shelf and activity exhibition two-column layouts and collapsing secondary course-manual sections on phones, without changing tablet or desktop composition.

**Architecture:** Keep the existing React page structure and CSS breakpoints. Add a small responsive disclosure state to `CourseSyllabus`, and wrap the existing `PptArchive` right-hand book page in a mobile-only disclosure from `OpenBook`; use CSS-only grid overrides for the bookshelf and album exhibition. The existing course, album, photo, and slide viewer interaction code remains the source of truth.

**Tech Stack:** Next.js App Router, React client components, TypeScript, CSS media queries, existing browser smoke checks.

---

### Task 1: Add mobile course-manual disclosures

**Files:**
- Modify: `components/teaching/course-syllabus.tsx`
- Modify: `components/teaching/open-book.tsx`
- Modify: `app/teaching.css`

- [ ] **Step 1: Add section keys and responsive open state**

  In `CourseSyllabus`, define stable keys for `about`, `contains`, and `syllabus`. In `OpenBook`, add a separate `lessonSlides` disclosure state around the existing `PptArchive` right-hand page. Initialize all four sections open for tablet/desktop and collapsed for phones. Subscribe to the media query so entering tablet/desktop forces all panels visible with `aria-expanded="true"`; entering phone collapses the panels unless the user has already explicitly opened one in the current manual.

- [ ] **Step 2: Render accessible disclosure controls**

  Keep the identity block, summary, metadata, and first short description outside disclosures. In `CourseSyllabus`, render native disclosure buttons for About this course, Included topics, and Syllabus preview. In `OpenBook`, render the same disclosure pattern around the existing PptArchive for Lesson slides. Every button gets `aria-expanded`, `aria-controls`, and a stable panel id; keep the existing slide-card entry behavior unchanged inside the Lesson slides panel.

- [ ] **Step 3: Add narrow-screen disclosure styling**

  Add styles in the final responsive override area of `app/teaching.css`. Desktop and tablet panels must remain visible with the current heading and spacing. At `max-width: 700px`, show a compact divider/button row and hide only closed panel content; preserve readable padding and 44px minimum touch targets.

- [ ] **Step 4: Run focused checks**

  Run `pnpm typecheck` and inspect the teaching page at 360×800 to confirm panels start collapsed, open independently, and preserve the course title/summary.

- [ ] **Step 5: Commit**

  ```powershell
  git add components/teaching/course-syllabus.tsx app/teaching.css
  git commit -m "feat: collapse course manual sections on mobile"
  ```

### Task 2: Make the mobile teaching shelf two columns

**Files:**
- Modify: `app/teaching.css`

- [ ] **Step 1: Replace the phone bookshelf flow**

  In the final `max-width: 700px` teaching override, change `.bookshelf-books` to a two-column grid with bounded column gaps and bottom alignment. Keep decorative books hidden and keep each `.course-book` inside the grid with a width that fits its column.

- [ ] **Step 2: Preserve book proportions and tap targets**

  Adjust only phone-specific book width/height and icon scale as needed. Keep the existing cover transforms, labels, and button semantics. Ensure the shelf wall height grows from the number of rows instead of clipping the third course.

- [ ] **Step 3: Run focused checks**

  At 360×800 and 390×844, verify the three courses form two columns, all book buttons are reachable, and `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

- [ ] **Step 4: Commit**

  ```powershell
  git add app/teaching.css
  git commit -m "style: use two-column mobile course shelf"
  ```

### Task 3: Make the mobile activity exhibition two columns

**Files:**
- Modify: `app/activities.css`

- [ ] **Step 1: Change only the phone exhibition grid**

  In the final `max-width: 700px` override, change `.album-exhibition-grid` to two equal columns with a reduced shelf row, while retaining the existing shelf background and card styling.

- [ ] **Step 2: Fit album cards to the new columns**

  Set `.album-slot` and `.wooden-album` widths to `100%` of their grid cell, reduce only phone-specific internal padding/photo height, and keep plaque text readable with wrapping. Do not alter the opened album’s photo wall rules.

- [ ] **Step 3: Run focused checks**

  At 360×800 and 390×844, verify all album buttons render in two columns, the shelf does not clip cards, and there is no page-level horizontal overflow.

- [ ] **Step 4: Commit**

  ```powershell
  git add app/activities.css
  git commit -m "style: use two-column mobile activity shelf"
  ```

### Task 4: Verify interactions and regressions

**Files:**
- Test: `components/teaching/course-syllabus.tsx`, `app/teaching.css`, `app/activities.css`

- [ ] **Step 1: Verify mobile interaction states in the browser**

  At 360×800, 390×844, 700×900, 701×900, and 768×1024:
  - open a course and confirm the manual panels start collapsed only on phones;
  - open each of the four panels independently and confirm `aria-expanded`/`aria-controls` changes;
  - resize from 700px to 701px and confirm all panels become visible with `aria-expanded="true"`;
  - open a lesson slide and close it;
  - open an activity album and confirm the photo wall remains two columns on phones;
  - open and close a photo lightbox;
  - verify no page-level horizontal overflow.

- [ ] **Step 2: Verify desktop composition**

  At a wide desktop viewport, confirm the bookshelf, manual spread, and album exhibition remain in their existing layouts and all manual sections are visible.

- [ ] **Step 3: Run repository checks**

  Run:

  ```powershell
  pnpm typecheck
  pnpm build
  git diff --check
  ```

  Restore `next-env.d.ts` to the repository’s expected references if Next regenerates it during verification.

- [ ] **Step 4: Commit verification-only fixes**

  If verification exposes a real responsive defect, apply the smallest targeted fix, rerun the affected check, and commit it with a focused message. Do not include unrelated visual polish.
