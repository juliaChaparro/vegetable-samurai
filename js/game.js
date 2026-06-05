import { EntidadesDoJogo } from "./entidades.js";
import { ControladorDeSpawn } from "./spawner.js";
import { Utils } from "./utils.js";

export class MotorDoJogo {
  constructor() {
    this.telaAtual = "menu";
    this.loopId = null;

    this.jogoRodando = false;

    this.spawner;
    this.entidades = new EntidadesDoJogo();
    this.tabuleiro = document.getElementById("game");

    // Elementos da UI
    this.telaMenu = document.getElementById("tela-menu");
    this.telaGameOver = document.getElementById("tela-gameover");

    this.ultimoFrameTime = Date.now();
  }

  inicializar() {
    console.log("Inicializado!");

    window.addEventListener("bombaExplodiu", () => {
      this.encerrarJogo(225); //testando apenas
    });

    this.mudarTela("menu");
  }

  mudarTela(novaTela) {
    this.telaAtual = novaTela;
    console.log(`Mudança de tela para -> ${this.telaAtual}`);

    if (this.telaMenu) this.telaMenu.style.display = "none";
    if (this.telaGameOver) this.telaGameOver.style.display = "none";

    if (this.telaAtual === "jogando") {
      this.jogoRodando = true;

      this.entidades.init();
      this.spawner = new ControladorDeSpawn(this.entidades);

      this.iniciarLoop();
    } else {
      this.jogoRodando = false; // Trava o jogo
      this.pararLoop();

      if (this.telaAtual === "menu" && this.telaMenu) {
        this.telaMenu.style.display = "flex";
      } else if (this.telaAtual === "gameover" && this.telaGameOver) {
        this.telaGameOver.style.display = "flex";
      }
    }
  }

  encerrarJogo(pontuacaoFinal) {
    const textoScoreFinal = document.getElementById("score-final");
    if (textoScoreFinal) {
      textoScoreFinal.innerText = pontuacaoFinal;
    }

    this.mudarTela("gameover");
  }

  iniciarLoop() {
    if (this.loopId) this.pararLoop();

    this.ultimoFrameTime = Date.now();

    const frameDoJogo = () => {
      if (!this.jogoRodando) return;

      const agora = Date.now();
      const deltaTime = (agora - this.ultimoFrameTime) / 1000; // em segundos
      this.ultimoFrameTime = agora;

      /* if (this.spawner) {
                this.spawner.update(deltaTime);
            }
            */

      let entidadesAtivas = this.entidades.todasAtivas;
      entidadesAtivas.forEach((entidade) => {
        entidade.update(deltaTime);
        entidade.render();
      });

      this.loopId = requestAnimationFrame(frameDoJogo);
    };

    this.loopId = requestAnimationFrame(frameDoJogo);
  }

  pararLoop() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
      console.log("Loop pausado/parado.");
    }
  }
}
