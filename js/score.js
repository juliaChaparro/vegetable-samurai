// =============================================================
// score.js — Objeto JUIZ (Sistema de Pontos, Efeitos e Áudio)
// Responsável: Membro 4
// Etapas 1-5: estrutura, cortarAlvo, HUD, Split, Splash,
//             Abóbora (vegetal prêmio), SFX, Best Score
// =============================================================
import { ESTADO_DO_JOGO } from "./config.js";

export const Juiz = {
  // ── Etapa 1: Propriedades internas ────────────────────────
  comboAtual: 0,
  tempoUltimoCorte: 0,
  JANELA_COMBO: 1000,

  elPontuacao: null,
  elVidas: null,
  elCombo: null,
  elBestScore: null,

  // ── Áudio ─────────────────────────────────────────────────
  _sfx: {
    corte: null,
    bomba: null,
    combo: null,
  },

  // ── Etapa 1: Inicialização ─────────────────────────────────
  init() {
    this.elPontuacao = document.getElementById("hud-pontuacao");
    this.elVidas = document.getElementById("hud-vidas");
    this.elCombo = document.getElementById("hud-combo");
    this.elBestScore = document.getElementById("hud-best-score");

    // Best Score — carrega do localStorage na inicialização
    const salvo = localStorage.getItem("vegetable_samurai_best");
    if (salvo !== null) {
      ESTADO_DO_JOGO.melhorPontuacao = parseInt(salvo, 10);
    }

    this._carregarSFX();
    this._atualizarHUD();
    console.log("[Juiz] Inicializado. HUD pronto.");
  },

  // ── SFX ────────────────────────────────────────────────────
  /**
   * Pré-carrega os arquivos de áudio.
   * Coloque os arquivos em assets/sfx/ com esses nomes.
   * @private
   */
  _carregarSFX() {
    const base = "./assets/sfx/";
    const arquivos = {
      corte: "corte.mp3",
      bomba: "bomba.mp3",
      combo: "combo.mp3",
    };

    for (const [chave, arquivo] of Object.entries(arquivos)) {
      const audio = new Audio(base + arquivo);
      audio.preload = "auto";
      // Não trava o jogo se o arquivo não existir
      audio.addEventListener("error", () => {
        console.warn(`[Juiz] SFX não encontrado: ${arquivo}`);
      });
      this._sfx[chave] = audio;
    }
  },

  /**
   * Dispara um SFX sem bloquear a thread.
   * @param {"corte"|"bomba"|"combo"} nome
   * @private
   */
  _tocarSFX(nome) {
    const audio = this._sfx[nome];
    if (!audio) return;
    // Clona para permitir sobreposição de sons rápidos
    const clone = audio.cloneNode();
    clone.volume = 0.6;
    clone.play().catch(() => {}); // ignora erros de política de autoplay
  },

  // ── Etapa 3/4: Lógica principal ───────────────────────────

  /**
   * Ponto de entrada chamado pelo Membro 2 (lâmina).
   * @param {HTMLElement} elementoAlvo
   * @param {{x: number, y: number}} [posCorte] coordenadas do corte para efeitos visuais
   */
  cortarAlvo(elementoAlvo, posCorte) {
    if (!elementoAlvo) return;

    const tipo = elementoAlvo.dataset.tipo || "fruta";

    if (tipo === "bomba") {
      this._registrarBomba(elementoAlvo);
      return;
    }

    this._registrarCorte(elementoAlvo, tipo, posCorte);
  },

  /**
   * @private
   */
  _registrarCorte(elementoAlvo, tipo, posCorte) {
    const agora = performance.now();
    const deltaT = agora - this.tempoUltimoCorte;

    if (deltaT <= this.JANELA_COMBO && this.tempoUltimoCorte !== 0) {
      this.comboAtual++;
    } else {
      this.comboAtual = 1;
    }
    this.tempoUltimoCorte = agora;

    let pontos = this._calcularPontos(tipo);

    if (this.comboAtual >= 3) {
      const multiplicador = this.comboAtual - 2;
      pontos += 10 * multiplicador;
      this._mostrarComboFeedback(this.comboAtual, pontos);
      this._tocarSFX("combo");
    } else {
      this._tocarSFX("corte");
    }

    ESTADO_DO_JOGO.pontuacao += pontos;

    // Pega posição do elemento antes de remover do DOM
    const rect = elementoAlvo.getBoundingClientRect();
    const cx = posCorte?.x ?? rect.left + rect.width / 2;
    const cy = posCorte?.y ?? rect.top + rect.height / 2;
    const spriteSrc =
      elementoAlvo.src || elementoAlvo.querySelector("img")?.src || "";
    const cor = this._corPorTipo(tipo);

    // Remove o original do DOM
    if (elementoAlvo.parentNode) {
      elementoAlvo.parentNode.removeChild(elementoAlvo);
    }

    // Efeitos visuais
    this._criarSplit(cx, cy, spriteSrc, tipo);
    this._criarSplash(cx, cy, cor);

    this._atualizarHUD();
    this._salvarBestScore();

    console.log(
      `[Juiz] ${tipo} cortado! +${pontos} pts | Combo: ${this.comboAtual}x`,
    );
  },

  /**
   * Tabela de pontos por tipo de vegetal.
   * @private
   */
  _calcularPontos(tipo) {
    const tabela = {
      abobora: 50, // Vegetal Prêmio (Etapa 5)
      melancia: 20,
      tomate: 10,
      cenoura: 10,
      cebola: 10,
      berinjela: 10,
      batata: 10,
      repolhoroxo: 10,
      fruta: 10, // fallback
    };
    return tabela[tipo] ?? 10;
  },

  /**
   * Cor de partícula por tipo, para o Splash.
   * @private
   */
  _corPorTipo(tipo) {
    const cores = {
      abobora: ["#FF8C00", "#FFA500", "#FFD700"],
      melancia: ["#ff4d6d", "#ff6b6b", "#c9f542"],
      tomate: ["#e63946", "#ff6b6b", "#ff9999"],
      cenoura: ["#ff7b00", "#ffaa44", "#ff5500"],
      cebola: ["#c77dff", "#e0aaff", "#ffffff"],
      berinjela: ["#7209b7", "#b5179e", "#f72585"],
      batata: ["#d4a373", "#ccd5ae", "#e9edc9"],
      repolhoroxo: ["#9d4edd", "#c77dff", "#e0aaff"],
    };
    return cores[tipo] ?? ["#ffffff", "#ffdd00", "#ff8800"];
  },

  /**
   * Reage a uma bomba cortada.
   * @private
   */
  _registrarBomba(elementoAlvo) {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    const rect = elementoAlvo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    ESTADO_DO_JOGO.vidas = 0;

    if (elementoAlvo.parentNode) {
      elementoAlvo.parentNode.removeChild(elementoAlvo);
    }

    this._criarExplosao(cx, cy);
    this._tocarSFX("bomba");
    this._atualizarHUD();
    this._salvarBestScore();

    console.warn("[Juiz] BOMBA cortada! Game Over.");
    // Membro 1 observa ESTADO_DO_JOGO.vidas === 0 para exibir Game Over
  },

  /**
   * Chamada pelo Membro 3 quando uma fruta cai sem ser cortada.
   */
  registrarFrutaPerdida() {
    this.comboAtual = 0;
    this.tempoUltimoCorte = 0;

    if (ESTADO_DO_JOGO.vidas > 0) {
      ESTADO_DO_JOGO.vidas--;
    }

    this._atualizarHUD();
    this._salvarBestScore();
    console.log(`[Juiz] Fruta perdida. Vidas: ${ESTADO_DO_JOGO.vidas}`);
  },

  // ── Etapa 4: Efeito Split ─────────────────────────────────

  /**
   * Cria duas metades da fruta que caem para os lados.
   * Usa clip-path CSS para simular o corte horizontal.
   * @private
   */
  _criarSplit(cx, cy, spriteSrc, tipo) {
    const game = document.getElementById("game");
    const TAM = 80;
    const offsetX = cx - TAM / 2;
    const offsetY = cy - TAM / 2;

    // Usa a imagem SVG do vegetal se disponível, senão cor sólida
    const usarImagem = spriteSrc && !spriteSrc.endsWith("undefined");

    [
      {
        clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
        vx: -140,
        label: "topo",
      },
      {
        clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
        vx: 140,
        label: "base",
      },
    ].forEach(({ clipPath, vx }) => {
      const el = document.createElement("div");
      el.style.cssText = `
                position: fixed;
                left: ${offsetX}px;
                top:  ${offsetY}px;
                width:  ${TAM}px;
                height: ${TAM}px;
                clip-path: ${clipPath};
                pointer-events: none;
                z-index: 200;
                overflow: hidden;
            `;

      if (usarImagem) {
        const img = document.createElement("img");
        img.src = spriteSrc;
        img.style.cssText = `width:${TAM}px; height:${TAM}px; display:block;`;
        el.appendChild(img);
      } else {
        const cor = this._corPorTipo(tipo)[0];
        el.style.background = cor;
        el.style.borderRadius = "50%";
      }

      game.appendChild(el);

      // Física simples: cai com gravidade e vai para o lado
      let x = offsetX,
        y = offsetY;
      let vy = -80,
        vxAtual = vx;
      const GRAV = 600;
      let ultimo = performance.now();

      const animar = (agora) => {
        const dt = (agora - ultimo) / 1000;
        ultimo = agora;
        vy += GRAV * dt;
        x += vxAtual * dt;
        y += vy * dt;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 1.2));

        if (y < window.innerHeight + TAM) {
          requestAnimationFrame(animar);
        } else {
          el.remove();
        }
      };
      requestAnimationFrame(animar);
    });
  },

  // ── Etapa 4: Efeito Splash (partículas) ───────────────────

  /**
   * Gera partículas coloridas no ponto do corte.
   * @param {number} cx  centro X (px, relativo à viewport)
   * @param {number} cy  centro Y
   * @param {string[]} cores  array de cores hex
   * @private
   */
  _criarSplash(cx, cy, cores) {
    const game = document.getElementById("game");
    const QTD = 12;
    const RAIO = 5;

    for (let i = 0; i < QTD; i++) {
      const angulo = (Math.PI * 2 * i) / QTD + (Math.random() - 0.5) * 0.8;
      const forca = 120 + Math.random() * 180;
      const vx = Math.cos(angulo) * forca;
      const vy = Math.sin(angulo) * forca - 60;
      const cor = cores[Math.floor(Math.random() * cores.length)];
      const r = RAIO * (0.6 + Math.random() * 0.8);

      const part = document.createElement("div");
      part.style.cssText = `
                position: fixed;
                left: ${cx - r}px;
                top:  ${cy - r}px;
                width:  ${r * 2}px;
                height: ${r * 2}px;
                border-radius: 50%;
                background: ${cor};
                pointer-events: none;
                z-index: 300;
                box-shadow: 0 0 4px ${cor};
            `;
      game.appendChild(part);

      let x = cx - r,
        y = cy - r;
      let vyAtual = vy,
        vxAtual = vx;
      const GRAV = 500;
      let ultimo = performance.now();
      let vida = 0;
      const VIDA_MAX = 0.55 + Math.random() * 0.2;

      const animar = (agora) => {
        const dt = (agora - ultimo) / 1000;
        ultimo = agora;
        vida += dt;
        vyAtual += GRAV * dt;
        x += vxAtual * dt;
        y += vyAtual * dt;
        const opacidade = Math.max(0, 1 - vida / VIDA_MAX);
        part.style.left = x + "px";
        part.style.top = y + "px";
        part.style.opacity = opacidade;

        if (opacidade > 0) {
          requestAnimationFrame(animar);
        } else {
          part.remove();
        }
      };
      requestAnimationFrame(animar);
    }
  },

  /**
   * Explosão de partículas para a bomba (maior e alaranjada).
   * @private
   */
  _criarExplosao(cx, cy) {
    const coresExplosao = ["#ff4500", "#ff8c00", "#ffd700", "#ff0000", "#fff"];
    // Mais partículas e raio maior que o splash normal
    const game = document.getElementById("game");
    const QTD = 22;
    const RAIO = 7;

    for (let i = 0; i < QTD; i++) {
      const angulo = (Math.PI * 2 * i) / QTD + (Math.random() - 0.5);
      const forca = 150 + Math.random() * 250;
      const vx = Math.cos(angulo) * forca;
      const vy = Math.sin(angulo) * forca - 80;
      const cor =
        coresExplosao[Math.floor(Math.random() * coresExplosao.length)];
      const r = RAIO * (0.7 + Math.random());

      const part = document.createElement("div");
      part.style.cssText = `
                position: fixed;
                left: ${cx - r}px; top: ${cy - r}px;
                width: ${r * 2}px; height: ${r * 2}px;
                border-radius: 50%;
                background: ${cor};
                pointer-events: none;
                z-index: 300;
                box-shadow: 0 0 8px ${cor};
            `;
      game.appendChild(part);

      let x = cx - r,
        y = cy - r;
      let vyAtual = vy,
        vxAtual = vx;
      const GRAV = 400;
      let ultimo = performance.now();
      let vida = 0;
      const VIDA_MAX = 0.7 + Math.random() * 0.3;

      const animar = (agora) => {
        const dt = (agora - ultimo) / 1000;
        ultimo = agora;
        vida += dt;
        vyAtual += GRAV * dt;
        x += vxAtual * dt;
        y += vyAtual * dt;
        const opacidade = Math.max(0, 1 - vida / VIDA_MAX);
        part.style.left = x + "px";
        part.style.top = y + "px";
        part.style.opacity = opacidade;

        if (opacidade > 0) requestAnimationFrame(animar);
        else part.remove();
      };
      requestAnimationFrame(animar);
    }
  },

  // ── Etapa 2/5: HUD ────────────────────────────────────────

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

  _mostrarComboFeedback(qtd, bonusPontos) {
    if (!this.elCombo) return;
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

  // ── Etapa 5: Best Score / localStorage ────────────────────

  /**
   * Salva o melhor score se a pontuação atual for maior.
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
   * Reseta o estado para um novo jogo.
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
