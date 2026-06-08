// =============================================================
// score.js — Juiz (Sistema de Pontos, HUD e Best Score)
// Responsável: Membro 4
// Depende de: GerenciadorDeParticulas (particulas.js)
//             GerenciadorDeSFX        (sfx.js)
// =============================================================
import { ESTADO_DO_JOGO } from "./config.js";
import { GerenciadorDeParticulas } from "./particulas.js";
import { GerenciadorDeSFX } from "./sfx.js";

export const Juiz = {
  // ── Propriedades internas ──────────────────────────────────
  comboAtual: 0,
  tempoUltimoCorte: 0,
  JANELA_COMBO: 1000,

  elPontuacao: null,
  elVidas: null,
  elCombo: null,
  elBestScore: null,

  particulas: null,
  sfx: null,

  // ── Inicialização ──────────────────────────────────────────

  /**
   * @brief Liga o HUD ao DOM, carrega SFX e Best Score salvo.
   * Chamado uma vez em main.js após o DOM estar pronto.
   */
  init() {
    this.elPontuacao = document.getElementById("hud-pontuacao");
    this.elVidas = document.getElementById("hud-vidas");
    this.elCombo = document.getElementById("hud-combo");
    this.elBestScore = document.getElementById("hud-best-score");

    this.particulas = new GerenciadorDeParticulas();

    this.sfx = new GerenciadorDeSFX();
    this.sfx.init();

    // Carrega o melhor score salvo
    const salvo = localStorage.getItem("vegetable_samurai_best");
    if (salvo !== null) {
      ESTADO_DO_JOGO.melhorPontuacao = parseInt(salvo, 10);
    }

    // Escuta o evento da Bomba (disparado por bomba.js no despawn('corte'))
    window.addEventListener("bombaExplodiu", (e) => {
      this._registrarBomba(e.detail?.cx, e.detail?.cy);
    });

    this._atualizarHUD();
    console.log("[Juiz] Inicializado. HUD pronto.");
  },


  tocarSom(nome) {
    if (this.sfx) this.sfx.tocar(nome);
  },
  
  // ── Ponto de entrada: vegetal cortado ─────────────────────

  /**
   * @brief Chamado por Vegetal.despawn('corte') quando um vegetal é cortado.
   * Recebe a instância da entidade já com ativo=false.
   * @param {EntidadeBase} entidade  Instância do vegetal cortado
   * @param {number} cx  Centro X na viewport
   * @param {number} cy  Centro Y na viewport
   */
  vegetalFoiCortado(entidade, cx, cy) {
    if (!entidade) return;

    const agora = performance.now();
    const deltaT = agora - this.tempoUltimoCorte;

    if (deltaT <= this.JANELA_COMBO && this.tempoUltimoCorte !== 0) {
      this.comboAtual++;
    } else {
      this.comboAtual = 1;
    }
    this.tempoUltimoCorte = agora;

    let pontos = this._calcularPontos(entidade.name);

    if (this.comboAtual >= 3) {
      const multiplicador = this.comboAtual - 2;
      pontos += 10 * multiplicador;
      this._mostrarComboFeedback(this.comboAtual, pontos);
      this.sfx.tocar("combo");
    } else {
      this.sfx.tocar("corte");
    }

    ESTADO_DO_JOGO.pontuacao += pontos;

    // Efeitos visuais no ponto do corte
    this.particulas.criarSplit(cx, cy, entidade.sprite.src, entidade.name);
    this.particulas.criarSplash(cx, cy, entidade.name);

    this._atualizarHUD();
    this._salvarBestScore();

    console.log(
      `[Juiz] ${entidade.name} cortado! +${pontos} pts | Combo: ${this.comboAtual}x`,
    );
  },

  // ── Bomba ──────────────────────────────────────────────────

  /**
   * @brief Chamado via evento 'bombaExplodiu' (disparado por bomba.js).
   * @param {number} cx  Centro X na viewport
   * @param {number} cy  Centro Y na viewport
   * @private
   */
  _registrarBomba(cx, cy) {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    ESTADO_DO_JOGO.vidas = 0;

    // Posição de fallback se não vier pelo evento
    const x = cx ?? window.innerWidth / 2;
    const y = cy ?? window.innerHeight / 2;

    this.particulas.criarExplosao(x, y);
    this.sfx.tocar("bomba");
    this._atualizarHUD();
    this._salvarBestScore();

    console.warn("[Juiz] BOMBA cortada! Game Over.");
    // MotorDoJogo escuta 'bombaExplodiu' e chama encerrarJogo()
  },

  // ── Madeira ────────────────────────────────────────────────

  /**
   * @brief Zera o combo sem descontar vida.
   * Chamado por Madeira.despawn('corte').
   */
  zerarCombo() {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;
    this._mostrarComboFeedback(0, 0); // apaga o feedback visual
    console.log("[Juiz] Combo zerado pela madeira.");
  },

  // ── Fruta perdida ──────────────────────────────────────────

  /**
   * @brief Chamada por Vegetal.despawn('normal') quando uma fruta cai no chão.
   * Desconta 1 vida e reseta o combo.
   */
  registrarFrutaPerdida() {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    if (ESTADO_DO_JOGO.vidas > 0) {
      ESTADO_DO_JOGO.vidas--;
    }

    this.sfx.tocar("falha");
    this._atualizarHUD();
    this._salvarBestScore();
    console.log(`[Juiz] Fruta perdida. Vidas: ${ESTADO_DO_JOGO.vidas}`);
  },

  // ── Tabela de pontos ───────────────────────────────────────

  /**
   * @private
   */
  _calcularPontos(tipo) {
    const tabela = {
      abobora: 50,
      melancia: 20,
      tomate: 10,
      cenoura: 10,
      cebola: 10,
      cebolaroxa: 10,
      berinjela: 10,
      batata: 10,
      brocolis: 10,
      pimentaoamarelo: 10,
      pimentaovermelho: 10,
      repolhoroxo: 10,
    };
    return tabela[tipo] ?? 10;
  },

  // ── HUD ────────────────────────────────────────────────────

  /**
   * @brief Sincroniza os elementos HTML com o estado atual do jogo.
   * @private
   */
  _atualizarHUD() {
    if (this.elPontuacao) {
      this.elPontuacao.textContent = String(ESTADO_DO_JOGO.pontuacao).padStart(
        6,
        "0",
      );
    }
    if (this.elBestScore) {
      this.elBestScore.textContent = String(
        ESTADO_DO_JOGO.melhorPontuacao,
      ).padStart(6, "0");
    }
    if (this.elVidas) {
      this._renderizarVidas();
    }
  },

  /**
   * @private
   */
  _renderizarVidas() {
    this.elVidas.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const icone = document.createElement("img");
      icone.className = "hud-vida-icone";
      icone.src =
        i < ESTADO_DO_JOGO.vidas
          ? "assets/Moeda_vida.svg"
          : "assets/Moeda_vida_perdida.svg";
      icone.alt = i < ESTADO_DO_JOGO.vidas ? "vida" : "vida perdida";
      if (i >= ESTADO_DO_JOGO.vidas) icone.classList.add("vida-perdida");
      this.elVidas.appendChild(icone);
    }
  },

  /**
   * @private
   */
  _mostrarComboFeedback(qtd, bonusPontos) {
    if (!this.elCombo) return;

    if (qtd === 0) {
      // Apaga imediatamente (chamado por zerarCombo)
      this.elCombo.textContent = "";
      this.elCombo.style.display = "none";
      this.elCombo.classList.remove("combo-ativo");
      return;
    }

    this.elCombo.textContent = `${qtd}x COMBO! +${bonusPontos}`;
    this.elCombo.style.display = "block";
    this.elCombo.classList.add("combo-ativo");

    clearTimeout(this._timerCombo);
    this._timerCombo = setTimeout(() => {
      if (this.elCombo) {
        this.elCombo.textContent = "";
        this.elCombo.style.display = "none";
        this.elCombo.classList.remove("combo-ativo");
      }
    }, 900);
  },

  // ── Best Score ─────────────────────────────────────────────

  /**
   * @brief Persiste o melhor score no localStorage se necessário.
   * @private
   */
  _salvarBestScore() {
    if (ESTADO_DO_JOGO.pontuacao > ESTADO_DO_JOGO.melhorPontuacao) {
      ESTADO_DO_JOGO.melhorPontuacao = ESTADO_DO_JOGO.pontuacao;
      localStorage.setItem(
        "vegetable_samurai_best",
        String(ESTADO_DO_JOGO.melhorPontuacao),
      );
      console.log(`[Juiz] Novo Best Score: ${ESTADO_DO_JOGO.melhorPontuacao}`);
    }
  },

  // ── Utilitário ─────────────────────────────────────────────

  /**
   * @brief Reseta o estado para um novo jogo.
   * Chamado pelo Membro 1 ao clicar em Reiniciar.
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
