// server/tts.ts — OpenAI & ElevenLabs TTS. Returns MP3 bytes for a given text.
// Uses OpenAI Audio Speech (default voice: nova) for sweet, expressive Delulu dialogue.

import OpenAI from "openai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const OPENAI_VOICE = (process.env.OPENAI_TTS_VOICE as any) ?? "nova";
const OPENAI_MODEL = process.env.OPENAI_TTS_MODEL ?? "tts-1";

let cachedOpenAI: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }
  if (!cachedOpenAI) cachedOpenAI = new OpenAI();
  return cachedOpenAI;
}

const ELEVEN_VOICE_ID = process.env.STAGE_VOICE_ID ?? "JBFqnCBsd6RMkjVDRZzb";
const ELEVEN_MODEL_ID = process.env.STAGE_TTS_MODEL ?? "eleven_flash_v2_5";

let cachedEleven: ElevenLabsClient | null = null;
function getElevenClient(): ElevenLabsClient {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set.");
  }
  if (!cachedEleven) cachedEleven = new ElevenLabsClient();
  return cachedEleven;
}

export async function synthesize(text: string): Promise<ArrayBuffer> {
  const startedAt = performance.now();

  // Primary: OpenAI Audio Speech TTS (cute, expressive, natural voice)
  if (process.env.OPENAI_API_KEY) {
    console.log("[tts] openai speech request", {
      voice: OPENAI_VOICE,
      model: OPENAI_MODEL,
      chars: text.length,
      text,
    });
    const mp3 = await getOpenAI().audio.speech.create({
      model: OPENAI_MODEL,
      voice: OPENAI_VOICE,
      input: text,
    });
    const buffer = await mp3.arrayBuffer();
    console.log("[tts] openai response", {
      chars: text.length,
      bytes: buffer.byteLength,
      ms: Math.round(performance.now() - startedAt),
    });
    return buffer;
  }

  // Fallback: ElevenLabs TTS
  if (process.env.ELEVENLABS_API_KEY) {
    console.log("[tts] eleven request", {
      voiceId: ELEVEN_VOICE_ID,
      modelId: ELEVEN_MODEL_ID,
      chars: text.length,
      text,
    });
    const stream = await getElevenClient().textToSpeech.convert(ELEVEN_VOICE_ID, {
      text,
      modelId: ELEVEN_MODEL_ID,
    });
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    let total = 0;
    for (const c of chunks) total += c.length;
    const out = new Uint8Array(new ArrayBuffer(total));
    let off = 0;
    for (const c of chunks) {
      out.set(c, off);
      off += c.length;
    }
    console.log("[tts] eleven response", {
      chars: text.length,
      bytes: total,
      ms: Math.round(performance.now() - startedAt),
    });
    return out.buffer as ArrayBuffer;
  }

  throw new Error("Neither OPENAI_API_KEY nor ELEVENLABS_API_KEY is set; server TTS disabled.");
}
