// src/theme.ts — Kids-friendly Theme Switcher with 3 interactive worlds:
// 1. 🎪 Magic Circus (Classic toy theater with golden ornaments & velvet red)
// 2. 🚀 Cosmic Galaxy (Space rocket station with neon cyan & starlight purple)
// 3. 🌈 Candy Land (Enchanted pastel fairy world with cupcakes & rainbows)

import { PUPPET_THEMES, type PuppetTheme } from "./puppet";
import type { TheaterThemeName } from "./theater";

export type ThemeId = "carnival" | "space" | "rainbow";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  icon: string;
  tagline: string;
  userPuppet: PuppetTheme;
  stagePuppet: PuppetTheme;
  theater: TheaterThemeName;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  carnival: {
    id: "carnival",
    name: "Magic Circus",
    badge: "🎪 Circus",
    icon: "🎪",
    tagline: "Golden stars, popcorn & magic theater!",
    userPuppet: PUPPET_THEMES.carnivalUser,
    stagePuppet: PUPPET_THEMES.carnivalStage,
    theater: "carnival",
  },
  space: {
    id: "space",
    name: "Cosmic Galaxy",
    badge: "🚀 Space",
    icon: "🚀",
    tagline: "Alien stars, laser beams & zero gravity!",
    userPuppet: PUPPET_THEMES.spaceUser,
    stagePuppet: PUPPET_THEMES.spaceStage,
    theater: "space",
  },
  rainbow: {
    id: "rainbow",
    name: "Candy Rainbow",
    badge: "🌈 Rainbow",
    icon: "🌈",
    tagline: "Sweet pastel fairies, unicorns & rainbows!",
    userPuppet: PUPPET_THEMES.rainbowUser,
    stagePuppet: PUPPET_THEMES.rainbowStage,
    theater: "rainbow",
  },
};

export class ThemeManager {
  private currentTheme: ThemeId;
  private root: HTMLDivElement;
  private listeners: ((theme: ThemeConfig) => void)[] = [];

  constructor() {
    const saved = (localStorage.getItem("virtual_delulu_theme") as ThemeId) || "carnival";
    this.currentTheme = THEMES[saved] ? saved : "carnival";

    this.root = document.createElement("div");
    this.root.id = "theme-switcher";
    this.root.className = "theme-switcher-bar";
    this.root.innerHTML = `
      <div class="theme-switcher-label">✨ Worlds:</div>
      <div class="theme-buttons">
        <button class="theme-btn" data-theme="carnival" title="Magic Circus (Toy Carnival)">
          <span class="theme-icon">🎪</span>
          <span class="theme-text">Circus</span>
        </button>
        <button class="theme-btn" data-theme="space" title="Cosmic Galaxy (Space Adventure)">
          <span class="theme-icon">🚀</span>
          <span class="theme-text">Space</span>
        </button>
        <button class="theme-btn" data-theme="rainbow" title="Candy Rainbow (Sweet Fairy Land)">
          <span class="theme-icon">🌈</span>
          <span class="theme-text">Rainbow</span>
        </button>
      </div>
    `;

    document.body.appendChild(this.root);
    this.applyTheme(this.currentTheme);
    this.setupListeners();
  }

  private setupListeners() {
    this.root.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".theme-btn") as HTMLButtonElement | null;
      if (!btn) return;
      const theme = btn.dataset.theme as ThemeId;
      if (theme && THEMES[theme]) {
        this.setTheme(theme);
      }
    });
  }

  getTheme(): ThemeConfig {
    return THEMES[this.currentTheme];
  }

  setTheme(id: ThemeId) {
    if (!THEMES[id]) return;
    this.currentTheme = id;
    try {
      localStorage.setItem("virtual_delulu_theme", id);
    } catch {
      // sandboxed
    }
    this.applyTheme(id);
    const config = THEMES[id];
    for (const cb of this.listeners) {
      cb(config);
    }
  }

  private applyTheme(id: ThemeId) {
    document.body.dataset.theme = id;
    const btns = this.root.querySelectorAll(".theme-btn");
    btns.forEach((b) => {
      if ((b as HTMLElement).dataset.theme === id) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  }

  onChange(cb: (theme: ThemeConfig) => void) {
    this.listeners.push(cb);
    // Fire immediately with current config
    cb(this.getTheme());
  }
}
