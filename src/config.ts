// src/config.ts — Backend endpoint resolution for local dev, tunnels, and Vercel hosting.

export const PUBLIC_TUNNEL_URL = "https://coming-chronic-arrange-trails.trycloudflare.com";

/**
 * Resolves the backend HTTP base URL (without trailing slash).
 * Priority:
 * 1. Query parameter ?backend=https://... (persisted to localStorage)
 * 2. LocalStorage virtual_delulu_backend
 * 3. Build-time VITE_BACKEND_URL
 * 4. Automatic Cloudflare Tunnel when running on vercel.app
 * 5. Window origin (for localhost dev or same-origin production hosting)
 */
export function getBackendHttpUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3001";
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get("backend");
    if (paramUrl) {
      const clean = paramUrl.replace(/\/+$/, "");
      localStorage.setItem("virtual_delulu_backend", clean);
      return clean;
    }

    const stored = localStorage.getItem("virtual_delulu_backend");
    if (stored) {
      return stored.replace(/\/+$/, "");
    }
  } catch {
    // localStorage may throw in restricted sandboxes
  }

  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_BACKEND_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // When hosted on Vercel, Vercel serverless cannot run long-lived WebSockets or Bun.
  // Connect automatically to our live AI backend tunnel.
  if (window.location.hostname.includes("vercel.app")) {
    return PUBLIC_TUNNEL_URL;
  }

  return window.location.origin;
}

/**
 * Resolves the WebSocket URL for the puppet brain session.
 */
export function getBackendWsUrl(brainSize: string): string {
  const httpUrl = getBackendHttpUrl();
  const wsProto = httpUrl.startsWith("https") ? "wss:" : "ws:";
  const host = httpUrl.replace(/^https?:\/\//, "");
  return `${wsProto}//${host}/ws?brain=${brainSize}`;
}
