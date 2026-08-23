# Mobile Typography and Illustration Restoration

> 历史设计记录：用于追溯已完成的排版与插画决策，不代表当前待办。

## Goal

Improve the already-compact phone layout by keeping short English section titles on one line where they fit and restoring existing educational illustrations that were hidden during density tuning.

## Scope

- CSS-only changes on the new `dev/mobile-typography-art` branch.
- Reuse the existing inline SVGs; add no image or resource files.
- Keep Chinese wrapping natural and keep desktop layout unchanged.
- Restore the homepage course-manual `rocket-sketch` at a compact size.
- Restore the Teaching page hero's ruler, bridge, and compass sketches with low-opacity, bounded placement.

## Acceptance criteria

- Only short English labels such as `Explore METC`, `Teaching Design`, `Classroom Activities`, and `Student Voices` may use a one-line rule; long editorial headlines continue to wrap naturally without overflow.
- Chinese titles remain readable and do not overflow at 360px and 390px.
- The rocket sketch is visible in the compact course-manual preview.
- Teaching hero sketches are visible at 360x800, 390x844, 768x1024, 820x1180, and 1024x768 without covering the heading, body copy, navigation, or CTA.
- No horizontal page overflow; desktop remains unchanged; typecheck/build pass.
