import { Juiz } from './score.js';
import { EntidadesDoJogo } from "./entidades.js";
import { ControladorDeSpawn } from "./spawner.js";
import { Utils } from "./utils.js";
import { DiretorDeJogo } from './diretor.js';
import { ESTADO_DO_JOGO } from './config.js';

export class MotorDoJogo {
  constructor() {
    this.telaAtual = "menu";
    this.loopId = null;

    this.jogoRodando = false;
    this.diretor;
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
      this.encerrarJogo(0); 
    });

    this.vincularBotoesAoCorte();

    this.mudarTela("menu");
  }

mudarTela(novaTela) {
    this.telaAtual = novaTela;
    console.log(`Mudança de tela para -> ${this.telaAtual}`);

    if (this.telaMenu)     this.telaMenu.style.display = "none";
    if (this.telaGameOver) this.telaGameOver.style.display = "none";

    if (this.telaAtual === "jogando") {
      this.jogoRodando = true;

      // pra consolidar o restart do jogo, resetamos o estado geral aqui
      ESTADO_DO_JOGO.vidas = 3;
      ESTADO_DO_JOGO.pontuacao = 0;

      Juiz.resetar();

      this.entidades.init();
      this.spawner = new ControladorDeSpawn(this.entidades);
      this.diretor = new DiretorDeJogo(this.spawner);
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

      if (ESTADO_DO_JOGO.vidas <= 0) {
          this.encerrarJogo(ESTADO_DO_JOGO.pontuacao || 0);
          return; // Para o frame imediatamente
      }

      const agora = Date.now();
      const deltaTime = (agora - this.ultimoFrameTime) / 1000; // em segundos
      this.ultimoFrameTime = agora;

      let entidadesAtivas = this.entidades.todasAtivas;
      entidadesAtivas.forEach((entidade) => {
        entidade.update(deltaTime);
        entidade.render();
      });

      if (this.diretor) this.diretor.update(deltaTime);

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

  vincularBotoesAoCorte() {
    const botoesConfig = [
        { id: 'botao-jogar', acao: 'jogar' },
        { id: 'botao-opcoes', acao: 'opcoes' },
        { id: 'botao-reiniciar', acao: 'jogar' }, // Reaproveita a lógica de iniciar o jogo
        { id: 'botao-voltar-menu', acao: 'menu' }
    ];

    botoesConfig.forEach(btn => {
        const el = document.getElementById(btn.id);
        if (!el) return;

        // 1. Damos a ele a classe que o colisao.js procura
        el.classList.add("entidadeDoJogo");

        // 2. Criamos o objeto que simula uma EntidadeBase
        el.entidadeReferencia = {
            // Um 'getter' dinâmico: o botão só fica "ativo" se estiver visível na tela
            get ativo() { return el.offsetParent !== null; },
            cortado: false,
            name: `Botão: ${btn.id}`,
            despawn: (tipo) => {
                if (tipo === 'corte') {
                    el.entidadeReferencia.cortado = true; // Impede ser fatiado 50x no mesmo milissegundo
                    console.log(`💥 Botão cortado: ${btn.id}`);
                    
                    // Executa a transição de tela
                    if (btn.acao === 'jogar') this.mudarTela('jogando');
                    else if (btn.acao === 'menu') this.mudarTela('menu');
                    else if (btn.acao === 'opcoes') console.log("Opções: Em desenvolvimento!");

                    // Reseta o botão meio segundo depois para futuras interações
                    setTimeout(() => { el.entidadeReferencia.cortado = false; }, 500);
                }
            }
        };
    });
}
}