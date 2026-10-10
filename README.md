# Virtual Delulu — Puppet Theater

> **DevDay Exchange Community Hackathon: Kochi** — 10–11 October 2026

A virtual puppet theater that runs in your browser. Your webcam tracks your
hand with MediaPipe and animates a puppet on stage. Opposite you, Delulu —
a cheerful AI-driven ghost character from Kerala — reacts to what you say
and do in real time, driven by Claude Opus 4.7.

## Project overview

- **Project name:** Virtual Delulu — Puppet Theater
- **Short description:** An AI co-creative puppet theater in the browser. Raise a hand, speak, and Delulu (an AI hand-puppet) performs, reacts, and generates brand-new 3D props on demand — all in real time.
- **Team:** Shijas T (@Shijas786), Allen P. Jison (@LyfSeeker)
- **Working demo:** https://virtual-delulu.vercel.app (or locally: `bun install && bun run dev:server && bun run dev` → `http://localhost:5173`). Grant webcam + mic, raise a hand.
- **Technology stack:** Bun · Vite · TypeScript · Three.js · MediaPipe Hands · Web Speech API · OpenAI GPT-4o (or Claude Opus 4.7) · OpenAI Audio TTS

See [SUBMISSION.md](./SUBMISSION.md) · [CHANGELOG.md](./CHANGELOG.md) · [AI_USAGE.md](./AI_USAGE.md) · [RULES.md](./RULES.md)

## Stack

- **Bun** — runtime and package manager
- **Vite** + **TypeScript** (strict) — frontend build
- **three.js** — 3D scene
- **@mediapipe/hands** — hand landmark tracking
- **Web Speech API** — browser speech recognition; browser synthesis as TTS fallback
- **openai** — OpenAI Audio TTS (voice: Nova) gives the puppet an expressive voice; GPT-4o drives dialogue and scene direction
- **@anthropic-ai/sdk** — alternative LLM backend support

## Requirements

**Hardware**

- A **webcam** — MediaPipe needs it to track your hand.
- A **microphone** — speech input drives the conversation.

**Browser**

- **Chrome** or **Edge** on desktop. The Web Speech API used for speech
  recognition is best supported there; Firefox and Safari are
  hit-or-miss.
- **HTTPS or `http://localhost`** — `getUserMedia` (camera/mic access)
  refuses to run on insecure origins.

**API keys**

- **`OPENAI_API_KEY`** *(recommended/primary)* — drives Delulu's brain (GPT-4o) and voice (OpenAI TTS).
- **`ANTHROPIC_API_KEY`** *(optional)* — alternative backend if running with Claude.
- **`ELEVENLABS_API_KEY`** *(optional)* — alternative TTS provider. Without server TTS keys, falls back to browser SpeechSynthesis.

**Computer specs**

The browser does a lot of work on-device: MediaPipe's hand-tracking
runs in WASM on your CPU every frame, and Three.js renders the stage
at 60 fps on the GPU. A reasonably modern machine handles it
comfortably; older or low-power hardware will lag.

## Run it

```sh
bun install
export ANTHROPIC_API_KEY=...     # required
export ELEVENLABS_API_KEY=...    # optional — better voice
bun run dev:server               # websocket brain on :3001
bun run dev                      # vite frontend on :5173
```

Open the frontend, grant webcam and microphone access, raise a hand.

## License

MIT — see [LICENSE](./LICENSE).
