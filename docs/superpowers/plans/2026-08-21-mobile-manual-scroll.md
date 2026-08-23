# Mobile Manual Internal Scroll Implementation Plan

> 历史实施记录：用于追溯当时任务；当前 disclosure 行为以 sticky accordion 实现与现行代码为准。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the mobile manual frame fixed while scrolling only its course spread.

**Architecture:** Adjust the existing mobile CSS only: prevent `.open-book-layer` scrolling, give `.open-book` a viewport-sized frame, pin the cover at the top, and make `.open-book-spread` the internal vertical scroll container. Existing disclosure components and dock behavior remain unchanged.

**Tech Stack:** Next.js, React, CSS media queries, TypeScript, browser responsive checks.

---

### Task 1: Restructure the mobile scroll container

**Files:**
- Modify: `app/teaching.css` mobile open-book rules.

- [ ] Set `.open-book-layer` to `overflow: hidden` at the phone breakpoint.
- [ ] Keep `.open-book` at `height: min(720px, calc(100svh - max(78px, calc(68px + env(safe-area-inset-top))) - 48px - max(16px, env(safe-area-inset-bottom)))` with `min-height: 440px`, so the frame fits between the existing layer padding and its `margin-top: 48px` at 360×800.
- [ ] Pin `.open-book-cover` with `position: absolute; inset: 0 0 auto; height: 142px`.
- [ ] Set `.open-book-spread` to `position: absolute; inset: 142px 0 0; overflow-y: auto; display: block` and preserve the existing vertical page order.
- [ ] Keep the current disclosure dock and page bottom spacing.

### Task 2: Verify scrolling and regressions

**Files:**
- No new test files; use local browser and build checks.

- [ ] At 360×800, open a course, scroll the spread, and verify the cover/back button bounding boxes remain stable.
- [ ] Verify `.open-book-layer.scrollTop` stays unchanged while `.open-book-spread.scrollTop` changes.
- [ ] Verify the spread scroll position changes and the final content can clear the bottom dock.
- [ ] Verify Syllabus and Lesson slides still open and close.
- [ ] At 700px verify phone behavior; at 701px verify tablet behavior; at desktop verify no regression.
- [ ] Run `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- [ ] Commit the implementation with a focused message.
