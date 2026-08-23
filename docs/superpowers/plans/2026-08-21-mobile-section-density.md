# Mobile Homepage Section Density Implementation Plan

> 历史实施记录：用于追溯已完成的密度调整，不代表当前待办。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the four homepage modules compact enough to read as roughly one phone viewport each while preserving their content and interactions.

**Architecture:** Add a final, phone-only CSS override block to the existing homepage stylesheet. The block keeps the existing component structure and changes only spacing, type scale, grids, and media aspect ratios. Validate with local browser measurements at phone, tablet, and desktop viewports.

**Tech Stack:** Next.js, React, CSS, pnpm, local browser viewport testing.

---

### Task 1: Add the phone density overrides

**Files:**
- Modify: `app/homepage.css` (final `@media (max-width: 760px)` override block)

- [ ] Reduce shared section padding and heading/body type sizes while retaining 44px controls; do not use line clamping or content clipping.
- [ ] Convert Explore mission/principle content to compact two-column grids and shorten jump rows.
- [ ] Reduce Teaching manual preview padding and visual scale without removing content.
- [ ] Shorten Activities media height and tighten intro/action spacing.
- [ ] Reduce Voices quote spacing and use a two-column side-story grid.
- [ ] Keep decorative-only overflow hidden and preserve safe-area/dialog rules.

### Task 2: Verify responsive geometry

**Files:**
- Test: local browser at `/`

- [ ] Run the local dev server from the responsive worktree.
- [ ] Measure section heights with `getBoundingClientRect().height` and document/body widths at 360x800 and 390x844 for both English and Chinese.
- [ ] Confirm no horizontal overflow and that interactive controls remain at least 44px.
- [ ] Smoke-test homepage anchors, dialogs, entry buttons, carousel controls/touch behavior, and language switching.
- [ ] Repeat a smoke check at 768x1024 and 1440x900 to ensure tablet/desktop are not regressed.

### Task 3: Run project verification and commit

**Files:**
- Test: `pnpm typecheck`
- Test: `pnpm build`

- [ ] Run typecheck and production build.
- [ ] Run `git diff --check`.
- [ ] Commit the CSS and documentation with a focused message.
