// =============================================================
// Etapa 1: estrutura base do Juiz
// Etapa 2: função cortarAlvo() + lógica de combos
// =============================================================
import { ESTADO_DO_JOGO } from "./config.js";

export const Juiz = {
  // ── Etapa 1: Propriedades internas ────────────────────────
  comboAtual: 0,
  tempoUltimoCorte: 0, // timestamp do último corte (ms)
  JANELA_COMBO: 1000, // intervalo máximo entre cortes para contar combo (ms)

  // Referências aos elementos do HUD (preenchidas em Juiz.init())
  elPontuacao: null,
  elVidas: null,
  elCombo: null,

  // ── Etapa 1: Inicialização ─────────────────────────────────
  /**
   * Guarda as referências dos elementos HTML do HUD e
   * renderiza os valores iniciais vindos de config.js.
   * Deve ser chamado uma vez, após o DOM estar pronto.
   */
  init() {
    this.elPontuacao = document.getElementById("hud-pontuacao");
    this.elVidas = document.getElementById("hud-vidas");
    this.elCombo = document.getElementById("hud-combo");

    this._atualizarHUD();
    console.log("[Juiz] Inicializado. HUD pronto.");
  },

  // ── Etapa 2: Lógica principal ──────────────────────────────

  /**
   * Chamada pelo Membro 2 quando a lâmina toca um alvo.
   * @param {HTMLElement} elementoAlvo - a <div> da fruta/bomba atingida
   */
  cortarAlvo(elementoAlvo) {
    if (!elementoAlvo) return;

    const tipo = elementoAlvo.dataset.tipo || "fruta";

    if (tipo === "bomba") {
      // Membro 1 conectará isso à Tela de Game Over na Etapa 5
      this._registrarBomba(elementoAlvo);
      return;
    }

    // É uma fruta normal (ou fruta prêmio)
    this._registrarCorte(elementoAlvo, tipo);
  },

  /**
   * Registra o corte de uma fruta, calcula combo e atualiza HUD.
   * @private
   */
  _registrarCorte(elementoAlvo, tipo) {
    const agora = performance.now();
    const deltaT = agora - this.tempoUltimoCorte;

    // ── Lógica de Combo ────────────────────────────────────
    if (deltaT <= this.JANELA_COMBO && this.tempoUltimoCorte !== 0) {
      this.comboAtual++;
    } else {
      this.comboAtual = 1;
    }
    this.tempoUltimoCorte = agora;

    // ── Cálculo de pontos ──────────────────────────────────
    let pontos = this._calcularPontos(tipo);

    // Bônus de combo a partir do 3º corte consecutivo
    if (this.comboAtual >= 3) {
      const multiplicador = this.comboAtual - 2; // +1×, +2×, +3×…
      pontos += 10 * multiplicador;
      this._mostrarComboFeedback(this.comboAtual, pontos);
    }

    ESTADO_DO_JOGO.pontuacao += pontos;

    // Remove o elemento do DOM (Etapa 3 — Membro 4 também faz isso aqui)
    if (elementoAlvo.parentNode) {
      elementoAlvo.parentNode.removeChild(elementoAlvo);
    }

    this._atualizarHUD();
    console.log(
      `[Juiz] Fruta cortada! +${pontos} pts | Combo: ${this.comboAtual}x`,
    );
  },

  /**
   * Retorna os pontos base de acordo com o tipo da fruta.
   * @private
   */
  _calcularPontos(tipo) {
    const tabela = {
      pessego: 50, // Fruta Prêmio (Etapa 5)
      melancia: 20,
      tomate: 10,
      cenoura: 10,
      fruta: 10, // fallback genérico
    };
    return tabela[tipo] ?? 10;
  },

  /**
   * Reage a uma bomba cortada: desconta vidas e reseta combo.
   * @private
   */
  _registrarBomba(elementoAlvo) {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    ESTADO_DO_JOGO.vidas = 0; // bomba encerra o jogo imediatamente

    if (elementoAlvo.parentNode) {
      elementoAlvo.parentNode.removeChild(elementoAlvo);
    }

    this._atualizarHUD();
    console.warn("[Juiz] BOMBA cortada! Game Over.");

    // Membro 1 escuta ESTADO_DO_JOGO.vidas === 0 para exibir Game Over
  },

  /**
   * Chamada pelo Membro 3 quando uma fruta cai sem ser cortada.
   * Desconta 1 vida e reseta o combo.
   */
  registrarFrutaPerdida() {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    if (ESTADO_DO_JOGO.vidas > 0) {
      ESTADO_DO_JOGO.vidas--;
    }

    this._atualizarHUD();
    console.log(
      `[Juiz] Fruta perdida. Vidas restantes: ${ESTADO_DO_JOGO.vidas}`,
    );
  },

  // ── Etapa 2: Atualização do HUD ────────────────────────────

  /**
   * Sincroniza os elementos HTML com os valores atuais do estado.
   * @private
   */
  _atualizarHUD() {
    if (this.elPontuacao) {
      this.elPontuacao.textContent = String(ESTADO_DO_JOGO.pontuacao).padStart(
        6,
        "0",
      );
    }
    if (this.elVidas) {
      this._renderizarVidas();
    }
  },

  /**
   * Renderiza ícones de vida (corações / imagens SVG).
   * @private
   */
  _renderizarVidas() {
    this.elVidas.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const icone = document.createElement("img");
      icone.className = "hud-vida-icone";

      if (i < ESTADO_DO_JOGO.vidas) {
        icone.src = "assets/Moeda_vida.svg";
        icone.alt = "vida";
      } else {
        icone.src = "assets/Moeda_vida_perdida.svg";
        icone.alt = "vida perdida";
        icone.classList.add("vida-perdida");
      }
      this.elVidas.appendChild(icone);
    }
  },

  /**
   * Exibe um feedback visual temporário de combo no HUD.
   * @private
   */
  _mostrarComboFeedback(qtd, bonusPontos) {
    if (!this.elCombo) return;
    this.elCombo.textContent = `${qtd}x COMBO! +${bonusPontos}`;
    this.elCombo.classList.add("combo-ativo");

    clearTimeout(this._timerCombo);
    this._timerCombo = setTimeout(() => {
      if (this.elCombo) {
        this.elCombo.textContent = "";
        this.elCombo.classList.remove("combo-ativo");
      }
    }, 900);
  },

  // ── Utilitário ─────────────────────────────────────────────

  /**
   * Reseta tudo para um novo jogo.
   * Chamado pelo Membro 1 ao reiniciar.
   */
  resetar() {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;
    ESTADO_DO_JOGO.pontuacao = 0;
    ESTADO_DO_JOGO.vidas = 3;
    this._atualizarHUD();
    console.log("[Juiz] Estado resetado para novo jogo.");
  },
};
