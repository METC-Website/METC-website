# Mobile Sticky Accordion Implementation Plan

> 历史实施记录：描述 sticky accordion 的实施来源；当前行为与细节以现行代码为准。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the mobile bottom disclosure dock with native sticky accordion titles inside the book scroll container.

**Architecture:** Keep each disclosure button in normal document flow, allow the section state set to contain multiple keys, and apply mobile `position: sticky` only to open inline titles. Remove unused portal rendering and its CSS.

**Tech Stack:** React client components, CSS `position: sticky`, TypeScript, responsive browser checks.

---

### Task 1: Update disclosure state and markup

**Files:**
- Modify: `components/teaching/course-syllabus.tsx`
- Modify: `components/teaching/open-book.tsx`
- Modify: `components/teaching/teaching-page.tsx`

- [ ] Allow independent mobile toggles without clearing other open keys.
- [ ] Remove portal floating controls and the now-unused `isDeckOpen` prop currently passed from `TeachingPage` to `OpenBook`.
- [ ] Apply the same independent-open behavior to the separately managed Lesson slides section in `OpenBook`.
- [ ] Keep `aria-expanded`, `aria-controls`, hidden panels, and focus restoration synchronized.

### Task 2: Add sticky mobile title styling

**Files:**
- Modify: `app/teaching.css`

- [ ] Make only open inline disclosure titles sticky at `top: 0` within the spread.
- [ ] Keep an opaque background, border, shadow, and stacking order.
- [ ] Remove obsolete bottom-dock rules and bottom-dock padding only from mobile rules; preserve desktop/tablet spacing.
- [ ] Leave tablet/desktop rules unchanged.

### Task 3: Verify

- [ ] At 360×800, open About, Included topics, Syllabus, and Lesson slides together and verify all four remain open.
- [ ] Verify the active title is sticky at the spread top and the next open title replaces it.
- [ ] Verify upward scrolling returns the previous title to normal flow.
- [ ] Open PPT and verify no disclosure portal is present.
- [ ] Run `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- [ ] Commit the implementation.
