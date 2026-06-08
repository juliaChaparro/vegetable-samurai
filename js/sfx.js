export class GerenciadorDeSFX {
  constructor() {
    this._sons = {
      corte: null,
      bomba: null,
      combo: null,
      arremessar: null,
      madeira: null,
      falha: null,
    };
    this.bgm = null;
    this.fadeInterval = null;
  }

  init() {
    const base = "./assets/sfx/";
    const arquivos = {
      corte: "corte.mp3",
      bomba: "bomba.mp3",
      combo: "combo.mp3",
      arremessar: "arremessar.mp3",
      madeira: "madeira.mp3",
      falha: "falha.mp3",
    };

    for (const [chave, arquivo] of Object.entries(arquivos)) {
      const audio = new Audio(base + arquivo);
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        console.warn(`[SFX] Arquivo não encontrado: ${arquivo}`);
      });
      this._sons[chave] = audio;
    }

    // --- SETUP DA TRILHA SONORA ---
    this.bgm = new Audio(base + "trilha.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0; // Começa mutado para o fade-in

    console.log("[SFX] Áudios carregados.");
  }

  tocar(nome) {
    const audio = this._sons[nome];
    if (!audio) return;
    const clone = audio.cloneNode();
    clone.volume = 0.6;
    clone.play().catch(() => {});
  }

  tocarBGM() {
    if (!this.bgm) return;
    clearInterval(this.fadeInterval);
    this.bgm.play().catch(() => {});
    
    // Fade-in (Aumenta o volume até 0.4 para não abafar os cortes)
    this.fadeInterval = setInterval(() => {
      if (this.bgm.volume < 0.4) {
        this.bgm.volume = Math.min(this.bgm.volume + 0.05, 0.4);
      } else {
        clearInterval(this.fadeInterval);
      }
    }, 200); // Executa a cada 200ms
  }

  pararBGM() {
    if (!this.bgm) return;
    clearInterval(this.fadeInterval);
    
    // Fade-out (Abaixa o volume até 0)
    this.fadeInterval = setInterval(() => {
      if (this.bgm.volume > 0.05) {
        this.bgm.volume = Math.max(this.bgm.volume - 0.05, 0);
      } else {
        this.bgm.volume = 0;
        this.bgm.pause();
        clearInterval(this.fadeInterval);
      }
    }, 200);
  }
}