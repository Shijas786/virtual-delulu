import { installSpeechUnlock } from "./speech";

export interface StageChatOptions {
  onSend: (text: string) => void;
}

export const THEME_SUGGESTIONS: Record<string, { label: string; prompt: string }[]> = {
  carnival: [
    { label: "🎪 Magic circus", prompt: "Welcome to our magic circus show!" },
    { label: "🎩 Top hat", prompt: "Put on a grand magician top hat!" },
    { label: "👑 Golden crown", prompt: "Wear a shiny golden royal crown!" },
    { label: "🍿 Popcorn time", prompt: "Can I have some crunchy circus popcorn?" },
    { label: "🎈 Circus balloons", prompt: "Hold a bunch of colorful floating balloons!" },
    { label: "🦁 Friendly lion", prompt: "Roar like a friendly circus lion!" },
  ],
  space: [
    { label: "🚀 Blast off", prompt: "3, 2, 1, blast off into outer space!" },
    { label: "👨‍🚀 Space helmet", prompt: "Put on an astronaut space helmet!" },
    { label: "👽 Alien friend", prompt: "Let's meet a cute, friendly green alien!" },
    { label: "⭐ Star dance", prompt: "Do a zero-gravity space dance!" },
    { label: "🛸 Flying saucer", prompt: "Look! A shiny flying saucer UFO is hovering!" },
    { label: "🕶️ Laser shades", prompt: "Put on futuristic glowing neon laser shades!" },
  ],
  rainbow: [
    { label: "🦄 Unicorn magic", prompt: "Summon a magical sparkle unicorn!" },
    { label: "🍭 Candy glasses", prompt: "Wear giant rainbow candy lollipop glasses!" },
    { label: "🌈 Rainbow slide", prompt: "Let's slide down a glowing glitter rainbow!" },
    { label: "🧁 Cupcake party", prompt: "Bake a magic frosted rainbow cupcake!" },
    { label: "🌸 Flower crown", prompt: "Wear a magical crown of glowing flowers!" },
    { label: "✨ Fairy wings", prompt: "Flap sparkling enchanted fairy wings!" },
  ],
};

export class StageChat {
  private root: HTMLDivElement;
  private input: HTMLInputElement;
  private suggestionsContainer: HTMLDivElement;

  constructor(private readonly options: StageChatOptions) {
    this.root = document.createElement("div");
    this.root.id = "stage-chat";
    this.root.innerHTML = `
      <div class="stage-chat-chips"></div>
      <form class="stage-chat-bar">
        <input 
          type="text" 
          class="stage-chat-input" 
          placeholder="Ask Delulu to wear a cap, change props, or say anything... (or use your mic)" 
          autocomplete="off"
        />
        <button type="submit" class="stage-chat-submit">Send</button>
      </form>
    `;

    document.body.appendChild(this.root);

    this.input = this.root.querySelector(".stage-chat-input") as HTMLInputElement;
    this.suggestionsContainer = this.root.querySelector(".stage-chat-chips") as HTMLDivElement;

    this.setTheme("carnival");
    this.setupListeners();
  }

  setTheme(themeName: string) {
    const list = THEME_SUGGESTIONS[themeName] ?? THEME_SUGGESTIONS.carnival ?? [];
    this.suggestionsContainer.innerHTML = list
      .map(
        (item) =>
          `<button class="stage-chip" data-prompt="${item.prompt}">${item.label}</button>`,
      )
      .join("");
  }

  private setupListeners() {
    const form = this.root.querySelector(".stage-chat-bar") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      installSpeechUnlock();
      const val = this.input.value.trim();
      if (!val) return;
      this.options.onSend(val);
      this.input.value = "";
    });

    this.suggestionsContainer.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".stage-chip") as HTMLButtonElement | null;
      if (!btn) return;
      installSpeechUnlock();
      const prompt = btn.dataset.prompt;
      if (prompt) {
        this.options.onSend(prompt);
      }
    });
  }

  setVisible(visible: boolean) {
    this.root.style.display = visible ? "flex" : "none";
  }
}
