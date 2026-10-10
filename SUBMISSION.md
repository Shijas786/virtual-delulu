# Project submission

Complete this file during the hackathon and use it to prepare your submission through the method announced by the organizers.

## Project

- **Project name:** Virtual Delulu — Puppet Theater
- **Short description:** A virtual puppet theater running entirely in the browser. Your webcam tracks your hand with MediaPipe and animates a hand-puppet on stage. Opposite you, Delulu — a cheerful AI-driven ghost character from Kerala — reacts to what you say and do in real time, driven by Claude Opus 4.7. The AI puppet speaks (ElevenLabs TTS), generates brand-new 3D scene props on demand, and reads your body language to adjust its performance.
- **Code repository URL:** https://github.com/Shijas786/virtual-delulu
- **Final submitted implementation commit SHA:** TODO — fill in after final commit
- **Working demo URL or local demo steps:** Run locally with `bun install && bun run dev:server` + `bun run dev`; open `http://localhost:5173`, grant webcam + mic access, raise a hand.
- **Demo access requirements:** `ANTHROPIC_API_KEY` required; `ELEVENLABS_API_KEY` optional (falls back to browser TTS).

## Participants

| Participant name | GitHub handle | Contribution |
| --- | --- | --- |
| Shijas T | @Shijas786 | Core architecture, server, session management, asset generation |
| Allen P. Jison | @LyfSeeker | Delulu character theming, stage UI, puppet visuals |

## Run and demonstrate

- **Prerequisites and versions:** Bun 1.4+
- **Install command:** `bun install`
- **Required environment variable names:** `ANTHROPIC_API_KEY` (required), `ELEVENLABS_API_KEY` (optional)
- **Start command:** `bun run dev:server` (port 3001) + `bun run dev` (port 5173) in separate terminals
- **Demo walkthrough:**
  1. Open `http://localhost:5173` in Chrome or Edge
  2. Grant webcam and microphone access
  3. Hold up one hand — your puppet appears on the left stage
  4. Speak — Delulu (right puppet) hears and responds with voice and animation
  5. Ask for a prop (e.g. "can you wear a top hat?") — the AI generates and places it live
- **Checks performed and results:** `bun test` — 51 tests pass; `bun --bun run build` — production bundle builds successfully
- **Known limitations:** Requires HTTPS or localhost for webcam access; Chrome/Edge recommended for Web Speech API support
