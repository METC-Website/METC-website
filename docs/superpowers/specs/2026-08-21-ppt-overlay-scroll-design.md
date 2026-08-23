# PPT overlay scroll design

> 历史设计记录：用于追溯已完成的 PPT 交互决策，不代表当前待办。

## Goal

Make the third-level PPT preview visually independent from the second-level course manual while preserving access to the manual’s scroll position.

## Design

- When `PptPreview` is open, the mobile `Lesson slides` disclosure dock is hidden.
- Wheel events over the PPT slide body (`.ppt-stage`) remain owned by the PPT viewer.
- Wheel events over the PPT header, controls, or backdrop are forwarded to the underlying course manual scroll container. On mobile this is `.open-book-spread`; on wider layouts it falls back to `.open-book-layer` when the spread is not independently scrollable.
- Closing the PPT preview leaves the course manual at the scroll position reached through forwarded wheel events.

## Validation

- Open a lesson deck on mobile and verify no `Lesson slides` dock is visible.
- Verify wheel events over the slide body do not move the course manual.
- Verify wheel events over the header/backdrop move the underlying manual.
- Verify closing PPT returns to the same manual position and existing close/keyboard controls still work.
- Run typecheck, build, and responsive browser checks.
