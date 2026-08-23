# Mobile disclosure dock design

> 历史设计记录：本方案已被后续 sticky accordion 方案取代，不得作为当前实现指引。

## Goal

Keep all four mobile course-manual sections—About this course, Included topics, Syllabus preview, and Lesson slides—easy to collapse without covering the course cover, back button, page heading, or the final lines of content while the user scrolls.

## Design

- On screens up to 700px wide, an expanded disclosure renders a compact fixed dock near the bottom of the viewport.
- The dock uses `position: fixed`, `z-index: 420`, `min-height: 48px`, `left: 78px`, `right: 22px`, and `bottom: max(20px, calc(env(safe-area-inset-bottom) + 14px))`. This leaves the lower-left N control unobstructed at 360px phone width.
- Open panels receive at least 96px of bottom padding so their final text, slide controls, or cards can scroll above the dock.
- The inline disclosure trigger is hidden only while its panel is open. When the panel is collapsed, the inline trigger returns to its original position.
- Syllabus, About this course, Included topics, and Lesson slides use the same interaction and visual treatment.
- Desktop and tablet behavior remain unchanged: disclosure headings and full panels stay visible as before.

## Interaction and accessibility

- The dock remains a native button with `aria-expanded="true"` and `aria-controls` pointing at the open panel.
- Activating the dock closes the panel and removes the dock.
- Closing the dock returns keyboard focus to the corresponding inline disclosure trigger.
- Only one course-manual section is open at a time on mobile; this matches the current mobile interaction model and keeps the page length manageable.
- Focus-visible outlines remain visible for keyboard users.

## Validation

- Verify the dock does not overlap the cover or back button at the top of the manual.
- Verify it remains reachable after scrolling to the end of a long syllabus.
- Verify the dock does not cover the final syllabus lines, lesson-slide controls, or the safe-area inset.
- Verify clicking it collapses the active panel.
- Run typecheck and production build; verify desktop layout has no floating dock.
