# Mobile sticky accordion design

> 历史设计记录：描述当前 sticky accordion 的设计来源；实现细节以现行代码为准。

## Goal

Allow several mobile course-manual sections to remain open while their section titles take turns sticking to the top of the internal book scroll area.

## Design

- Mobile sections start collapsed but can be opened independently; toggling one section no longer closes the others.
- An open section’s inline title button becomes `position: sticky; top: 0` inside `.open-book-spread`.
- The sticky title has an opaque paper background and a higher stacking order so content cannot show through it.
- Later open sections naturally replace earlier sticky titles as their own section boundaries reach the same top edge; scrolling upward returns titles to normal flow.
- Remove the previous portal-based bottom disclosure buttons. The inline title is the only control, including for Lesson slides.
- Desktop and tablet behavior remain unchanged.

## Validation

- Verify two or more sections can be open at once on a 360px viewport.
- Verify an open title sticks at the spread top while its panel scrolls below it.
- Verify the next open title replaces it and upward scrolling restores the earlier title.
- Verify no disclosure portal appears while a PPT preview is open.
- Run typecheck, build, and responsive browser checks.
