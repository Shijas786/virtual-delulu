import { installSpeechUnlock } from "./speech";

export interface StageChatOptions {
  onSend: (text: string) => void;
}

export interface PromptItem {
  label: string;
  prompt: string;
}

export const THEME_PROMPTS_POOL: Record<string, PromptItem[]> = {
  carnival: [
    { label: "🎪 Magic circus", prompt: "Welcome to our magic circus show!" },
    { label: "🎩 Magician hat", prompt: "Put on a grand magician top hat!" },
    { label: "👑 Golden crown", prompt: "Wear a shiny golden royal crown!" },
    { label: "🍿 Popcorn time", prompt: "Can I have some crunchy circus popcorn?" },
    { label: "🎈 Circus balloons", prompt: "Hold a bunch of colorful floating balloons!" },
    { label: "🦁 Friendly lion", prompt: "Roar like a friendly circus lion!" },
    { label: "🔴 Red clown nose", prompt: "Put on a silly bright red clown nose!" },
    { label: "🤹 Juggling act", prompt: "Can you juggle three invisible golden balls?" },
    { label: "🪄 Magic wand", prompt: "Wave a sparkling magic wand and cast a spell!" },
    { label: "🥁 Drumroll please", prompt: "Play an exciting circus drumroll!" },
    { label: "🥨 Giant pretzel", prompt: "Can you munch on a delicious giant pretzel?" },
    { label: "🎟️ Golden ticket", prompt: "Here is your VIP golden circus ticket!" },
    { label: "🎭 Masquerade mask", prompt: "Put on a fancy sparkling masquerade mask!" },
    { label: "🐒 Monkey dance", prompt: "Do a funny playful monkey dance!" },
    { label: "🎺 Circus trumpet", prompt: "Blow a loud cheerful circus trumpet!" },
    { label: "🎠 Merry-go-round", prompt: "Spin around like a merry-go-round carousel!" },
    { label: "🌟 Take a bow", prompt: "Spotlight is on you! Take a grand theatrical bow!" },
    { label: "🎪 Silly joke", prompt: "Tell me a hilarious circus knock-knock joke!" },
  ],
  space: [
    { label: "🚀 Blast off", prompt: "3, 2, 1, blast off into outer space!" },
    { label: "👨‍🚀 Space helmet", prompt: "Put on a futuristic astronaut helmet!" },
    { label: "👽 Alien friend", prompt: "Let's meet a cute, friendly green alien!" },
    { label: "⭐ Zero-g dance", prompt: "Do a funny zero-gravity space dance!" },
    { label: "🛸 Flying saucer", prompt: "Look! A shiny flying saucer UFO is hovering!" },
    { label: "🕶️ Laser shades", prompt: "Put on glowing neon laser shades!" },
    { label: "🪐 Saturn's rings", prompt: "Let's surf on Saturn's glowing rings!" },
    { label: "☄️ Shooting star", prompt: "Make a wish on a passing shooting star!" },
    { label: "🤖 Robot voice", prompt: "Talk like a friendly robot companion beep boop!" },
    { label: "🌙 Moonwalk", prompt: "Show me your best slow-motion moonwalk!" },
    { label: "🌌 Starlight sky", prompt: "Fill the theater with sparkling starlight and galaxies!" },
    { label: "👾 Alien high five", prompt: "Give the little space alien a high five!" },
    { label: "⚡ Laser shield", prompt: "Activate your glowing cosmic laser shield!" },
    { label: "🔭 Space explorer", prompt: "What strange new planets do you see through your telescope?" },
    { label: "🛸 Hyperspace jump", prompt: "Prepare for lightspeed hyperspace jump!" },
    { label: "🪐 Alien pet", prompt: "Can you hatch a little purple alien egg?" },
  ],
  rainbow: [
    { label: "🦄 Unicorn magic", prompt: "Summon a magical sparkle unicorn!" },
    { label: "🍭 Candy glasses", prompt: "Wear giant rainbow candy lollipop glasses!" },
    { label: "🌈 Rainbow slide", prompt: "Let's slide down a glowing glitter rainbow!" },
    { label: "🧁 Cupcake party", prompt: "Bake a magic frosted rainbow cupcake!" },
    { label: "🌸 Flower crown", prompt: "Wear a magical crown of glowing flowers!" },
    { label: "✨ Fairy wings", prompt: "Flap sparkling enchanted fairy wings!" },
    { label: "🍬 Gummy bears", prompt: "Shower the stage with dancing gummy bears!" },
    { label: "🍩 Donut headband", prompt: "Wear a sweet pink sprinkle donut headband!" },
    { label: "🍦 Ice cream cone", prompt: "What is your favorite magic ice cream flavor?" },
    { label: "🧚 Fairy dust", prompt: "Sprinkle sparkling fairy dust all over the stage!" },
    { label: "🍓 Strawberry hat", prompt: "Put on an adorable strawberry beret hat!" },
    { label: "🪄 Bubble spell", prompt: "Cast a spell that makes gigantic rainbow soap bubbles!" },
    { label: "🧸 Teddy bear hug", prompt: "Give a giant fuzzy teddy bear a big hug!" },
    { label: "🥞 Rainbow pancakes", prompt: "Flip a delicious stack of colorful rainbow pancakes!" },
    { label: "🎀 Glitter ribbon", prompt: "Tie a shiny shimmering fairy ribbon!" },
    { label: "🏰 Candy castle", prompt: "Let's build a delicious castle made of cotton candy!" },
  ],
};

export class StageChat {
  private root: HTMLDivElement;
  private input: HTMLInputElement;
  private suggestionsContainer: HTMLDivElement;
  private currentTheme = "carnival";

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

    this.refreshSuggestions();
    this.setupListeners();
  }

  setTheme(themeName: string) {
    this.currentTheme = themeName;
    this.refreshSuggestions();
  }

  refreshSuggestions() {
    const pool = THEME_PROMPTS_POOL[this.currentTheme] ?? THEME_PROMPTS_POOL.carnival ?? [];
    if (pool.length === 0) return;

    // Pick 5 random items without replacement
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 5);

    const buttonsHtml = chosen
      .map(
        (item) =>
          `<button class="stage-chip" data-prompt="${item.prompt}">${item.label}</button>`,
      )
      .join("");

    const shuffleBtn = `<button class="stage-chip stage-chip-shuffle" title="Get fresh prompt ideas">🎲 Shuffle</button>`;

    this.suggestionsContainer.innerHTML = buttonsHtml + shuffleBtn;
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
      this.refreshSuggestions();
    });

    this.suggestionsContainer.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".stage-chip") as HTMLButtonElement | null;
      if (!btn) return;
      installSpeechUnlock();

      if (btn.classList.contains("stage-chip-shuffle")) {
        this.refreshSuggestions();
        return;
      }

      const prompt = btn.dataset.prompt;
      if (prompt) {
        this.options.onSend(prompt);
        // Refresh prompts after user click so it always feels fresh
        this.refreshSuggestions();
      }
    });
  }

  setVisible(visible: boolean) {
    this.root.style.display = visible ? "flex" : "none";
  }
}
