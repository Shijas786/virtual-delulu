# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-11T07:28:00+05:30 — Add interactive Theme Switcher with 3 kids-friendly interfaces

- Changed: `src/theme.ts`, `src/theater.ts`, `src/puppet.ts`, `src/stage-chat.ts`, `src/landing.ts`, `src/main.ts`, `index.html`, `tests/theme.test.ts`
- Why: Added an interactive, playful Theme Switcher button floating at top-right and on the preflight landing screen with 3 distinct kid-friendly interfaces:
  1. 🎪 Magic Circus: Classic toy theater with velvet curtains, golden ornaments, circus badges, and festive prompt chips.
  2. 🚀 Cosmic Space: Futuristic galaxy adventure with neon cyan/turquoise proscenium lighting, deep void starry background, and astronaut/alien prompt chips.
  3. 🌈 Candy Rainbow: Whimsical fairy wonderland with bubblegum pink/coral curtains, pastel lilac trim, unicorn/lollipop prompt chips, and soft sweet footlights.
- Validation: Verified 56 `bun test` passing across 10 test suites; verified dynamic Three.js material recoloring and stage lighting in `theater.setTheme()`, `puppet.setPuppetTheme()`, and `stageChat.setTheme()`; verified Vite build and Vercel deployment.
- Limitations: None.

- Changed: `src/config.ts`, `src/main.ts`, `src/speech.ts`, `src/landing.ts`, `src/assetlab.ts`, `server/index.ts`, `server/limits.ts`
- Why: Vercel serverless hosting cannot maintain persistent WebSockets (`/ws`) or run background Bun servers. Added dynamic backend endpoint routing in `src/config.ts`, enabled CORS & preflight OPTIONS handling in `server/index.ts`, allowed tunnel origins in `server/limits.ts`, and connected the live production deployment on Vercel to a secure Cloudflare Tunnel endpoint.
- Validation: Verified HTTP 101 WebSocket handshake and live `gpt-6-luna` completion over Cloudflare Tunnel; verified OPTIONS 204 preflight with `access-control-allow-origin`; verified 53 `bun test` passing; verified production build and deployment to `https://virtual-delulu.vercel.app`.
- Limitations: When running on Vercel, the backend server process and tunnel must be running to handle live AI dialogues and TTS.

- Changed: `server/index.ts`, `server/llm.ts`, `server/asset-generator.ts`, `server/openai.test.ts`, `index.html`, `.env`
- Why: Switched large brain model and 3D asset generator to OpenAI `gpt-6-luna` for faster, low-latency puppet dialogues and rapid asset generation without wait times.
- Validation: Verified live completion from `gpt-6-luna`; verified 53 `bun test` suite passing; verified asset generation loop.
- Limitations: None.

## 2026-10-11T01:44:00+05:30 — Upgrade primary LLM model and 3D asset generator to GPT-6 Astra

- Changed: `server/index.ts`, `server/llm.ts`, `server/asset-generator.ts`, `server/openai.test.ts`, `index.html`, `.env`
- Why: Upgraded default large brain model and parametric 3D asset generation model from GPT-4o to OpenAI's advanced agentic model `gpt-6-astra` for richer, faster reasoning and high-fidelity scene direction.
- Validation: Verified live JSON structured completion from `gpt-6-astra`; verified 53 `bun test` suite passing; verified asset generation and speech generation loop.
- Limitations: None.

## 2026-10-11T01:29:00+05:30 — Align canonical puppet theater architecture and visuals with rhmoller reference

- Changed: `src/puppet.ts`, `src/puppet-stage.ts`, `src/landing.ts`, `src/hud.ts`, `index.html`
- Why: Aligned puppet visual architecture, split-jaw rig, and landing preflight flow with `rhmoller/virtual-puppet-theater`, while retaining OpenAI integration (`gpt-4o`/`gpt-4o-mini`, OpenAI speech synthesis, OpenAI asset generation) and stage prompt interaction.
- Validation: Verified `bun test` passes 53 tests; verified `/tts` audio generation; verified build with Vite.
- Limitations: None.

## 2026-10-11T00:54:00+05:30 — Interactive stage chat & prompt chips, audio playback unlock & origin support

- Changed: `src/stage-chat.ts`, `src/main.ts`, `src/brain.ts`, `src/landing.ts`, `src/speech.ts`, `server/limits.ts`, `server/index.ts`, `index.html`
- Why:
  1. Guaranteed instant prop generation and speech interaction by adding on-stage quick-prompt chips (e.g. 🧢 "Wear a cap", 👑 "Golden crown", 🕶️ "Sunglasses", 🌸 "Jasmine flowers", 🏖️ "Moonlit beach") and an in-stage chat input that sends speech transcripts directly to Delulu.
  2. Fixed audio playback by ensuring Web Audio context and browser speech synthesis are unlocked on landing and stage interactions, and routed the landing "Say hello" button to test OpenAI Nova TTS directly with fallback.
  3. Expanded `originAllowed` in `server/limits.ts` to support `.vercel.app` domains and any local ports.
- Validation: Verified `/tts` returns `audio/mpeg` (200 OK) for both localhost and Vercel origins; `bun test` passes all 53 tests; Vite build succeeded.
- Limitations: None.

- Changed: `server/llm.ts`
- Why: OpenAI API requires the word 'json' in messages when `response_format: { type: "json_object" }` is enabled; added explicit JSON schema instructions to system prompt so live speech recognition turns trigger AI responses without 400 errors.
- Validation: Verified live WebSocket turn-by-turn conversation and speech responses via `ws://localhost:3001/ws`.
- Limitations: None.

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
