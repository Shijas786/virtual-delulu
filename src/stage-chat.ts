import { installSpeechUnlock } from "./speech";

export interface StageChatOptions {
  onSend: (text: string) => void;
}

export class StageChat {
  private root: HTMLDivElement;
  private input: HTMLInputElement;
  private suggestionsContainer: HTMLDivElement;

  constructor(private readonly options: StageChatOptions) {
    this.root = document.createElement("div");
    this.root.id = "stage-chat";
    this.root.innerHTML = `
      <div class="stage-chat-chips">
        <button class="stage-chip" data-prompt="Can you wear a cool cap?">🧢 Wear a cap</button>
        <button class="stage-chip" data-prompt="Wear a shiny golden crown!">👑 Golden crown</button>
        <button class="stage-chip" data-prompt="Put on stylish sunglasses!">🕶️ Sunglasses</button>
        <button class="stage-chip" data-prompt="Can you wear sweet jasmine flowers?">🌸 Jasmine flowers</button>
        <button class="stage-chip" data-prompt="Let's go to the beach under the moonlight!">🏖️ Moonlit beach</button>
        <button class="stage-chip" data-prompt="Change your hair color to hot pink!">🎨 Pink hair</button>
      </div>
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

    this.setupListeners();
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
