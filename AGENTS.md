# Agent guide for hackathon projects

## Event requirements

- Read [RULES.md](RULES.md) before working. Build project implementation from scratch at the event; do not import a pre-built project.
- Libraries, APIs, and public datasets are allowed. Document their sources and use.
- Use Codex during development and briefly record its actual contribution in [AI_USAGE.md](AI_USAGE.md).
- Prepare a code repository, short project description, and working demo in [SUBMISSION.md](SUBMISSION.md).

## Use basic coding patterns

- Prefer straightforward, idiomatic code: small functions, clear names, simple data structures, and modules with one clear responsibility.
- Use the project's existing patterns. Add an abstraction only when an actual repeated need makes the code easier to understand.
- Choose the simplest implementation that meets the current requirement. Avoid unnecessary layers, generic frameworks, premature optimization, and speculative features.
- Keep dependencies few and purposeful. Reuse appropriate standard libraries and established libraries instead of reimplementing them.
- Validate inputs, handle errors explicitly, and show useful failure messages. Do not hide failures behind fabricated success or demo data.
- Keep changes focused. Explain the reason for non-obvious decisions in short comments or project documentation.

## Document every meaningful change

- Update [CHANGELOG.md](CHANGELOG.md) in the same commit as each meaningful change. Record the date and time with timezone, what changed, why, the affected files or feature, validation performed, and known limitations.
- Update [README.md](README.md) whenever setup, commands, environment requirements, project behavior, or demo instructions change.
- Update [AI_USAGE.md](AI_USAGE.md) whenever Codex makes a meaningful contribution. Record the task, assistance, human review status, checks, and any corrections. Brief summaries are enough; full chat transcripts are unnecessary.
- Keep claims accurate. Distinguish implemented and verified behavior from planned or incomplete work. Never invent test results, deployment success, AI usage, or commit timestamps.

## Make regular, timely commits

1. Inspect `git status` before editing. Preserve teammates' work and identify files before modifying them.
2. Stage and commit after each meaningful change. Include the CHANGELOG update in the same commit.
3. Write short, descriptive commit messages: `feat: add X`, `fix: correct Y`, `docs: update Z`.
4. Push regularly so your work is visible and backed up.
