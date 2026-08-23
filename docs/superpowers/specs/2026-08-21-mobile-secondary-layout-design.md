# Mobile Secondary Layout Design

> 历史设计记录：用于追溯已完成的移动端布局决策，不代表当前待办。

## Goal

Reduce unnecessary vertical scrolling on the mobile teaching and activities pages while keeping the desktop composition unchanged and preserving the existing reading order.

## Scope

### 1. Teaching course shelf (`/teaching`, `components/teaching/bookshelf.tsx`)

- At phone widths, render the course books in a two-column shelf grid.
- Keep each book's existing cover treatment, tap target, label, and open-course behavior.
- Phone behavior is two columns below `700px`.
- Tablet behavior (`701px` and above) keeps the current bookshelf layout, including any existing tablet two-column arrangement.

### 2. Teaching course manual (`/teaching`, `components/teaching/open-book.tsx` and `components/teaching/course-syllabus.tsx`)

- Keep the manual as a vertically readable page rather than forcing a horizontal spread on a phone.
- In `CourseSyllabus`, group the existing sections into disclosure panels:
  - About this course
  - Included topics
  - Syllabus preview
  - Lesson slides
- The course cover, category, title, summary, metadata row, and the first short course description remain visible by default for every course.
- The secondary panels are collapsed by default on narrow screens and can be opened independently.
- Opening a panel must not navigate away or alter desktop behavior.
- Lesson-slide preview continues to open the existing slide viewer.

### 3. Activities album exhibition (`/activities`, `components/activities/activities-page.tsx` and `app/activities.css`)

- At phone widths below `700px`, render album cards in two columns to reduce the long single-column shelf.
- Preserve the existing card interaction and the currently approved double-column photo wall inside an opened album.
- Keep the album detail view vertically scrollable, with no horizontal page overflow.
- Keep tablet and desktop exhibition layouts unchanged.

## Interaction and accessibility

- All existing buttons remain keyboard and touch accessible.
- Disclosure controls use native buttons with `aria-expanded` and an associated content region.
- Existing focus restoration for course, album, photo, and viewer dialogs remains intact.
- No new external data, resources, or dependencies are introduced.

## Responsive boundaries

- Phone layout: apply the new shelf/albums and disclosure behavior at exactly `max-width: 700px`.
- Tablet layout (`701px`–`1100px`): preserve the current visual layout and sizing, including the existing tablet shelf rules.
- Desktop layout (`1101px` and above): preserve the current visual layout and sizing.
- Verify at 360×800, 390×844, 768×1024, and a desktop viewport.

## Verification

- `pnpm typecheck`
- `pnpm build`
- `git diff --check`
- Browser checks at phone and tablet sizes:
  - course shelf shows two columns;
  - course manual secondary panels start collapsed and open independently;
  - activity shelf shows two columns;
  - opened album photo wall remains two columns on phones;
  - no page-level horizontal overflow;
  - slide/photo/viewer dialogs still open and close correctly.
- Desktop regression check at a representative wide viewport confirms the existing teaching shelf, manual spread, and activities exhibition remain unchanged.

## Non-goals

- No desktop redesign.
- No typography/color polish in this pass.
- No resource-path or Cloudflare R2 changes.
