# Notes

A sticky-notes canvas built with React 19, Vite 7, and plain CSS. Write, drag, recolour, and restore deleted notes with Undo. Existing note content, positions, and legacy colour IDs remain readable.

## Development

Requires Node.js 20.19+ (or a newer supported Node release).

```sh
npm ci
npm run dev
```

## Use

- Add a note with the plus button. Select a note to change its colour.
- Drag the header to move a note. The canvas scrolls to accommodate notes.
- Tab to a card and use arrow keys to move it; Shift moves in larger steps. Enter focuses its text, Escape leaves editing, and Ctrl/Cmd + Delete removes the focused note.
- Text, colour, and position changes save automatically after a short pause. Leaving the text field flushes its pending save.
- A failed save keeps the draft in the open tab and offers Retry save. Drafts are not an offline store; keep the tab open until Saved appears.
- Undo recreates a deleted note with its original text, colour, and position and a new server ID. The Undo notification stays until used or dismissed.

## Structure

- `src/components/`: board, cards, toolbar, icons, and notifications.
- `src/hooks/`: React subscriptions, pointer dragging, keyboard controls, and toast lifecycle.
- `src/lib/`: API client, backwards-compatible note encoding, colour tokens, and a testable notes store. The store merges edits immediately, debounces saves, and serializes writes per note.
- `src/styles.css`: design tokens, component styles, and responsive layouts.
- `api/notes/`: Vercel route entry points; `server/proxyNotes.js` shares proxy handling and preserves upstream HTTP failures.
- `tests/`: store/format/proxy regressions and browser interaction tests.

## Checks

```sh
npm run lint
npm test
npm run test:e2e
npm run build
```