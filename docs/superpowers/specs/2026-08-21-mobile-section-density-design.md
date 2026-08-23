# Mobile Homepage Section Density Design

> 历史设计记录：用于追溯已完成的首页密度决策，不代表当前待办。

## Goal

On phone-sized screens, make the homepage read as a sequence of compact modules: header, four homepage sections, and footer. Each section should be approximately one viewport tall instead of requiring several swipes before the next section begins.

## Scope

- Phone layout only (`max-width: 760px`); desktop and existing tablet layout remain unchanged.
- CSS-only changes in `app/homepage.css`.
- Preserve all existing content and interactions; reduce visual density through smaller type, tighter spacing, compact grids, and shorter media frames.
- Do not change R2 URLs, resources, JSX, route behavior, or page content.

## Layout decisions

1. Keep the hero at roughly one viewport, with its existing stacked mobile composition.
2. Compress Explore by using two-column compact mission/principle layouts, shorter jump rows, smaller headings, and reduced section padding.
3. Compress Teaching by keeping the course-manual preview compact and using a two-column mini-spread rather than two full-width stacked pages.
4. Compress Activities by shortening the mobile photo frame and tightening intro/action spacing.
5. Compress Voices by reducing quote scale and arranging side stories into two columns.
6. Keep touch targets at least 44px where they remain interactive. Decorative artwork may be hidden, but text, course content, buttons, and interactive media must not be removed, line-clamped, or clipped to meet the height target.

## Acceptance criteria

- Measure each section with `getBoundingClientRect().height`, including padding and excluding the fixed header overlay; use both English and Chinese content.
- At 360x800 and 390x844, each homepage section after the header should be approximately 1.0–1.2 viewport heights where the complete content can fit, and no section should exceed two viewport heights.
- Desktop (1440px) section geometry is unchanged by the new rules.
- Existing routes still build successfully and the homepage has no failed image loads.
- Homepage anchor links, dialogs, section entry buttons, carousel controls/touch gestures, and language switching remain usable.
