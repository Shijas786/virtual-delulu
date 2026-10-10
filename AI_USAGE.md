# AI usage record

Use Codex during the hackathon and briefly document its actual contribution here. Add a row after each meaningful task or milestone. Keep summaries concise and omit secrets, private data, and full chat transcripts.

## Event build log

| Date and time with timezone | Tool / model, if known | Task | Assistance and affected files | Human review / corrections | Validation and result |
| --- | --- | --- | --- | --- | --- |
| 2026-10-10T22:00:00+05:30 | Claude Opus 4.7 (Anthropic) | AI puppet dialogue, emotion, gesture control | `server/session.ts`, `server/llm.ts`, `server/protocol.ts` — LLM drives real-time puppet speech, emotions, and scene direction | Reviewed — logic verified against session tests | `bun test` — 7 session tests pass |
| 2026-10-10T22:00:00+05:30 | Claude Opus 4.7 (Anthropic) | On-demand 3D asset generation | `server/asset-generator.ts`, `server/asset-generator-prompt.ts` — LLM generates parametric Three.js AssetSpec JSON from natural language | Reviewed — output validated against render pipeline | Assets render correctly in browser |
| 2026-10-10T23:00:00+05:30 | Antigravity (Google DeepMind) | Project cleanup: author rewrite, hackathon ref removal, template compliance | All docs, config, and git history | Reviewed by Shijas T | `bun test` 51 pass; build succeeds |
| 2026-10-10T23:46:00+05:30 | Antigravity (Google DeepMind) | Vercel production hosting and deployment linking | `SUBMISSION.md`, `README.md`, `CHANGELOG.md`, `.gitignore` | Reviewed by Shijas T | Deployed to https://virtual-delulu.vercel.app; HTTP 200 verified |
| 2026-10-11T00:08:00+05:30 | Antigravity (Google DeepMind) | Visual cuteness overhaul & OpenAI migration | `src/puppet-stage.ts`, `server/llm.ts`, `server/tts.ts`, `server/asset-generator.ts`, `server/index.ts` | Reviewed by Shijas T | `bun test` 53 tests pass; build succeeded; redeployed to Vercel |
