// =============================================================
// particulas.js — GerenciadorDeParticulas
// Responsável: Membro 4
// Cria os efeitos visuais de Split (metades) e Splash (partículas)
// Segue o padrão de classe do projeto (constructor + métodos)
// =============================================================

export class GerenciadorDeParticulas {
  constructor() {
    this.game = document.getElementById("game");

    // Cores de suco por tipo de vegetal
    this._cores = {
      abobora: ["#FF8C00", "#FFA500", "#FFD700"],
      melancia: ["#ff4d6d", "#ff6b6b", "#c9f542"],
      tomate: ["#e63946", "#ff6b6b", "#ff9999"],
      cenoura: ["#ff7b00", "#ffaa44", "#ff5500"],
      cebola: ["#c77dff", "#e0aaff", "#ffffff"],
      cebolaroxa: ["#9d4edd", "#c77dff", "#e0aaff"],
      berinjela: ["#7209b7", "#b5179e", "#f72585"],
      batata: ["#d4a373", "#ccd5ae", "#e9edc9"],
      brocolis: ["#57cc04", "#80ed99", "#38b000"],
      pimentaoamarelo: ["#FFD700", "#FFC300", "#FFB700"],
      pimentaovermelho: ["#e63946", "#c1121f", "#ff9999"],
      repolhoroxo: ["#9d4edd", "#c77dff", "#e0aaff"],
    };
  }

  /**
   * @brief Retorna as cores do tipo de vegetal, com fallback genérico.
   * @param {string} tipo
   * @returns {string[]}
   */
  _obterCores(tipo) {
    return this._cores[tipo] ?? ["#ffffff", "#ffdd00", "#ff8800"];
  }

  // ── Split ──────────────────────────────────────────────────

  /**
   * @brief Cria duas metades do vegetal cortado que caem para os lados.
   * Chamado por Vegetable.aoSerCortado().
   * @param {number} cx  Centro X do vegetal no momento do corte (viewport px)
   * @param {number} cy  Centro Y
   * @param {string} spriteSrc  URL do SVG do vegetal
   * @param {string} tipo  Nome do vegetal
   */
  criarSplit(cx, cy, spriteSrc, tipo) {
    const TAM = 80;
    const offsetX = cx - TAM / 2;
    const offsetY = cy - TAM / 2;
    const usarImagem = spriteSrc && !spriteSrc.endsWith("undefined");

    const metades = [
      { clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", vx: -140 },
      { clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)", vx: 140 },
    ];

    metades.forEach(({ clipPath, vx }) => {
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
        el.style.background = this._obterCores(tipo)[0];
        el.style.borderRadius = "50%";
      }

      this.game.appendChild(el);
      this._animarSplit(el, offsetX, offsetY, vx);
    });
  }

  /**
   * @brief Anima a física de queda de uma metade do vegetal.
   * @private
   */
  _animarSplit(el, startX, startY, vx) {
    let x = startX,
      y = startY;
    let vy = -80;
    const GRAV = 600;
    let ultimo = performance.now();

    const animar = (agora) => {
      const dt = (agora - ultimo) / 1000;
      ultimo = agora;
      vy += GRAV * dt;
      x += vx * dt;
      y += vy * dt;
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 1.2));

      if (y < window.innerHeight + 80) {
        requestAnimationFrame(animar);
      } else {
        el.remove();
      }
    };
    requestAnimationFrame(animar);
  }

  // ── Splash ─────────────────────────────────────────────────

  /**
   * @brief Gera partículas de suco no ponto exato do corte.
   * Chamado por Vegetable.aoSerCortado().
   * @param {number} cx  Centro X (viewport px)
   * @param {number} cy  Centro Y
   * @param {string} tipo  Nome do vegetal (para escolher as cores)
   */
  criarSplash(cx, cy, tipo) {
    const cores = this._obterCores(tipo);
    const QTD = 12;
    const RAIO_MAX = 5;

    for (let i = 0; i < QTD; i++) {
      const angulo = (Math.PI * 2 * i) / QTD + (Math.random() - 0.5) * 0.8;
      const forca = 120 + Math.random() * 180;
      const vx = Math.cos(angulo) * forca;
      const vy = Math.sin(angulo) * forca - 60;
      const cor = cores[Math.floor(Math.random() * cores.length)];
      const r = RAIO_MAX * (0.6 + Math.random() * 0.8);

      const part = this._criarParticula(
        cx - r,
        cy - r,
        r * 2,
        cor,
        "300",
        "4px",
      );
      this._animarParticula(
        part,
        cx - r,
        cy - r,
        vx,
        vy,
        500,
        0.55 + Math.random() * 0.2,
      );
    }
  }

  // ── Explosão (bomba) ───────────────────────────────────────

  /**
   * @brief Gera a explosão de partículas quando uma bomba é cortada.
   * Chamado por Juiz._registrarBomba().
   * @param {number} cx
   * @param {number} cy
   */
  criarExplosao(cx, cy) {
    const cores = ["#ff4500", "#ff8c00", "#ffd700", "#ff0000", "#fff"];
    const QTD = 22;
    const RAIO = 7;

    for (let i = 0; i < QTD; i++) {
      const angulo = (Math.PI * 2 * i) / QTD + (Math.random() - 0.5);
      const forca = 150 + Math.random() * 250;
      const vx = Math.cos(angulo) * forca;
      const vy = Math.sin(angulo) * forca - 80;
      const cor = cores[Math.floor(Math.random() * cores.length)];
      const r = RAIO * (0.7 + Math.random());

      const part = this._criarParticula(
        cx - r,
        cy - r,
        r * 2,
        cor,
        "300",
        "8px",
      );
      this._animarParticula(
        part,
        cx - r,
        cy - r,
        vx,
        vy,
        400,
        0.7 + Math.random() * 0.3,
      );
    }
  }

  // ── Helpers internos ───────────────────────────────────────

  /**
   * @brief Cria e injeta no DOM um elemento de partícula circular.
   * @private
   */
  _criarParticula(x, y, tam, cor, zIndex, glowSize) {
    const part = document.createElement("div");
    part.style.cssText = `
            position: fixed;
            left: ${x}px;
            top:  ${y}px;
            width:  ${tam}px;
            height: ${tam}px;
            border-radius: 50%;
            background: ${cor};
            pointer-events: none;
            z-index: ${zIndex};
            box-shadow: 0 0 ${glowSize} ${cor};
        `;
    this.game.appendChild(part);
    return part;
  }

  /**
   * @brief Anima uma partícula com física (gravidade + fade).
   * @private
   */
  _animarParticula(part, startX, startY, vx, vy, gravidade, vidaMax) {
    let x = startX,
      y = startY;
    let vyAtual = vy,
      vxAtual = vx;
    let vida = 0;
    let ultimo = performance.now();

    const animar = (agora) => {
      const dt = (agora - ultimo) / 1000;
      ultimo = agora;
      vida += dt;
      vyAtual += gravidade * dt;
      x += vxAtual * dt;
      y += vyAtual * dt;
      const op = Math.max(0, 1 - vida / vidaMax);
      part.style.left = x + "px";
      part.style.top = y + "px";
      part.style.opacity = op;

      if (op > 0) requestAnimationFrame(animar);
      else part.remove();
    };
    requestAnimationFrame(animar);
  }
}
