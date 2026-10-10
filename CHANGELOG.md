# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-10T23:28:00+05:30 — Theme and Delulu character integrated

- Changed: `index.html`, `src/hud.ts`, `src/landing.ts`, `src/puppet-stage.ts`, `src/puppet.ts`
- Why: Themed the puppet theater around the Delulu character; custom colors, UI text, and stage props applied.
- Validation: Dev server started with `bun run dev`; visual UI verified in browser.
- Limitations: None identified in these checks.

## 2026-10-10T22:00:00+05:30 — Initial build of Virtual Delulu

- Changed: All source files — TypeScript frontend (`src/`), server (`server/`), build config, docs.
- Why: Full initial implementation of the AI-driven puppet theater with MediaPipe hand tracking, Three.js scene, Claude Opus 4.7 dialogue, ElevenLabs TTS, and real-time body language streaming.
- Validation: `bun test` — 51 tests pass. `bun --bun run build` — production build succeeds.
- Limitations: Requires Node 20+/Bun for Vite 8 build step; dev server works with Bun runtime directly.
