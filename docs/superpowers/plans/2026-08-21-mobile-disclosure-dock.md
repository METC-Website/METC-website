# Mobile Disclosure Dock Implementation Plan

> 历史实施记录：底部 disclosure dock 已被后续 sticky accordion 方案取代，不得作为当前实现指引。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the mobile course-manual collapse control from the top of the viewport to a bottom dock that avoids the cover, back button, and N control.

**Architecture:** Keep the existing portal-based control, but position it at the mobile viewport bottom and add safe bottom space to the open panel. Add focus restoration when the dock closes. Desktop and tablet CSS remain unchanged.

**Tech Stack:** Next.js App Router, React client components, CSS media queries, Playwright browser checks, TypeScript.

---

### Task 1: Update mobile disclosure behavior

**Files:**
- Modify: `components/teaching/course-syllabus.tsx`
- Modify: `components/teaching/open-book.tsx`

- [ ] Add focus restoration to the inline trigger after closing a mobile dock.
- [ ] Keep the existing one-open-section-at-a-time behavior.
- [ ] Run `pnpm typecheck`.

### Task 2: Redesign the dock position and spacing

**Files:**
- Modify: `app/teaching.css`

- [ ] Under `@media (max-width: 700px)`, position `.book-disclosure-floating-trigger` with `position: fixed`, `z-index: 420`, `min-height: 48px`, `left: 78px`, `right: 22px`, and `bottom: max(20px, calc(env(safe-area-inset-bottom) + 14px))`.
- [ ] Add at least `96px` of bottom padding to open disclosure panels so final text/cards/slide controls can scroll above the dock, and verify the computed spacing at 360px.
- [ ] Keep the desktop rule `display: none` and existing inline desktop layout.

### Task 3: Verify responsive behavior

**Files:**
- No new test files; use local browser and build checks.

- [ ] At 360×800, open each of About this course, Included topics, Syllabus, and Lesson slides; verify each uses the bottom-right dock and only one section is open at a time.
- [ ] Verify the dock does not cover the cover/back button at the top, the final syllabus text, lesson-slide controls, or the safe-area inset.
- [ ] Scroll to the end, verify the dock remains reachable and the final content can clear it.
- [ ] Click the dock, verify the panel closes and focus returns to its inline trigger.
- [ ] At exactly 700px and at 701px, verify the phone dock appears only at 700px and tablet behavior remains unchanged at 701px.
- [ ] At desktop width, verify no portal dock exists and all panels remain visible.
- [ ] Run `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- [ ] Commit the implementation with a focused message.
