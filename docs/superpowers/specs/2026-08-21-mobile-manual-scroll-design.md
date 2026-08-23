# Mobile manual internal scrolling design

> 历史设计记录：用于追溯内部滚动决策；disclosure 行为以 sticky accordion 与现行代码为准。

## Goal

Keep the mobile course manual’s outer frame, cover, and back control at the same top boundary while the course content scrolls inside the manual.

## Design

- At widths up to 700px, the modal layer does not scroll.
- The open-book frame stays in place and uses the available viewport height: `min(720px, calc(100svh - max(78px, calc(68px + env(safe-area-inset-top))) - 48px - max(16px, env(safe-area-inset-bottom))))`, with a 440px minimum.
- The cover is absolutely pinned to the top of the frame at 142px high.
- The book spread is absolutely positioned from 142px to the bottom of the frame and becomes the only vertical scroll container, containing the course pages and lesson slides in their existing order.
- The bottom disclosure dock remains fixed to the viewport and the open panel keeps bottom padding so its last content can clear the dock.
- Tablet and desktop layouts are unchanged.

## Validation

- Scroll the mobile manual down and verify the cover top and back button do not move into the content.
- Verify the spread scroll position changes while the outer modal layer does not.
- Verify Syllabus and Lesson slides still collapse from the bottom dock.
- Verify the 700px phone breakpoint and 701px tablet behavior remain correct.
- Run typecheck, production build, and responsive browser checks.
