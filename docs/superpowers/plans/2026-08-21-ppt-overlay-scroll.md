# PPT Overlay Scroll Implementation Plan

> 历史实施记录：用于追溯已完成的 PPT 交互调整，不代表当前待办。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Hide the underlying lesson dock during PPT preview and route non-slide wheel input to the course manual.

**Architecture:** Pass an `isDeckOpen` flag from `TeachingPage` to `OpenBook` to suppress the portal dock. Add a wheel handler to `PptPreview` that leaves `.ppt-stage` untouched and scrolls the mobile spread or wider modal layer for other targets.

**Tech Stack:** React client components, TypeScript, CSS/DOM scrolling, browser responsive checks.

---

### Task 1: Hide the second-level dock

**Files:**
- Modify: `components/teaching/teaching-page.tsx`
- Modify: `components/teaching/open-book.tsx`

- [ ] Pass `isDeckOpen={Boolean(deck)}` into `OpenBook`.
- [ ] Add the prop and suppress the mobile Lesson slides portal while it is true.

### Task 2: Route overlay wheel events

**Files:**
- Modify: `components/teaching/ppt-preview.tsx`

- [ ] Add a wheel handler that ignores events whose target is inside `.ppt-stage`.
- [ ] For other targets, call `preventDefault()`, use the wheel event’s `deltaY`, and scroll `.open-book-spread` when it has independent overflow; otherwise scroll `.open-book-layer`.
- [ ] Keep existing close, fullscreen, keyboard, and slide controls unchanged.

### Task 3: Verify

- [ ] At 360×800, open a deck and verify the dock is absent.
- [ ] Verify slide-body wheel leaves `.ppt-stage`, `.open-book-spread`, and `.open-book-layer` scroll positions unchanged.
- [ ] Verify header/backdrop wheel changes `.open-book-spread.scrollTop` on mobile and `.open-book-layer.scrollTop` on wider layouts.
- [ ] Verify closing the deck keeps the manual position and restores the Lesson slides dock.
- [ ] Run `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- [ ] Commit the implementation.
