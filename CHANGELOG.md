# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-11T00:19:00+05:30 — Secure environment configuration & .env.example

- Changed: `.gitignore`, `.env.example`
- Why: Configured OpenAI environment variables for Vercel deployment; added `.env.example` template for development setup while strictly ignoring `.env` to protect secret keys from exposure.
- Validation: Verified `.env` is ignored by Git; verified Vercel production, preview, and development environments store `OPENAI_API_KEY`.
- Limitations: None.

## 2026-10-11T00:08:00+05:30 — Delulu aesthetic cuteness boost & OpenAI LLM/Audio migration

- Changed: `src/puppet-stage.ts`, `server/llm.ts`, `server/tts.ts`, `server/asset-generator.ts`, `server/index.ts`, `server/openai.test.ts`, `SUBMISSION.md`, `README.md`
- Why:
  1. Enhanced Delulu's visual cuteness: anime double-sparkle glint eyes, midnight-violet pupils, delicate upper eyelashes, radiant rosy blush with white cheek highlights, golden jasmine centers, sweet kitten/cupid smile, gold maang tikka droplet, and face-framing curl tendrils.
  2. Switched LLM backend and Audio TTS to OpenAI: implemented `OpenAIBackend` (`gpt-4o` / `gpt-4o-mini`) with JSON structured actions and voice selection; integrated OpenAI Audio Speech API (`tts-1`, voice: `nova`) for expressive character speech; supported on-demand 3D asset generation via OpenAI.
- Validation: `bun test` passes 53 tests (including new `openai.test.ts`); production build succeeded; live deployed to Vercel.
- Limitations: Live speech synthesis requires `OPENAI_API_KEY` set in server environment.

## 2026-10-10T23:46:00+05:30 — Deploy web client to Vercel

- Changed: `SUBMISSION.md`, `README.md`, `.gitignore`
- Why: Deployed web client to Vercel (`https://virtual-delulu.vercel.app`) for live hackathon demonstration.
- Validation: Production build passed with Vite v8; HTTP 200 confirmed on `https://virtual-delulu.vercel.app`.
- Limitations: Full real-time AI puppet dialogue requires backend WebSocket connection; client connects locally or to configured backend endpoint.

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
