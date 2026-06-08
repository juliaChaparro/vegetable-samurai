// =============================================================
// sfx.js — GerenciadorDeSFX
// Responsável: Membro 4
// Gerencia o carregamento e disparo dos efeitos sonoros do jogo
// Coloque os arquivos em assets/sfx/ (corte.mp3, bomba.mp3, combo.mp3)
// =============================================================

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
  }

  /**
   * @brief Pré-carrega todos os arquivos de áudio.
   * Deve ser chamado uma vez em Juiz.init().
   */
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

    console.log("[SFX] Áudios carregados.");
  }

  /**
   * @brief Dispara um efeito sonoro. Clona o áudio para permitir sobreposição.
   * @param {'corte'|'bomba'|'combo'} nome
   */
  tocar(nome) {
    const audio = this._sons[nome];
    if (!audio) return;
    const clone = audio.cloneNode();
    clone.volume = 0.6;
    clone.play().catch(() => {}); // ignora bloqueio de autoplay do navegador
  }
}
