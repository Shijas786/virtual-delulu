import { test, expect } from "bun:test";
import { OpenAIBackend } from "./llm.ts";

test("OpenAIBackend constructor creates backend with openai model prefix", () => {
  const backend = new OpenAIBackend("gpt-4o-mini");
  expect(backend.name).toBe("openai-gpt-4o-mini");
  const defaultBackend = new OpenAIBackend();
  expect(defaultBackend.name).toBe("openai-gpt-6-astra");
});

test("OpenAIBackend pickVoice returns null when voice list is empty", async () => {
  const backend = new OpenAIBackend();
  const pick = await backend.pickVoice([]);
  expect(pick).toBeNull();
});
