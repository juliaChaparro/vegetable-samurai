import { EntidadesDoJogo } from './entidades.js';
import { ControladorDeSpawn } from './spawner.js';
import { Utils } from './utils.js';

export class MotorDoJogo {
    constructor() {
        this.telaAtual = 'menu'; 
        this.loopId = null;      
        
        // NOVA VARIÁVEL DE CONTROLE
        this.jogoRodando = false; 

        this.spawner;
        this.entidades = new EntidadesDoJogo();
        this.tabuleiro = document.getElementById('game');
        
        // Elementos da UI
        this.telaMenu = document.getElementById('tela-menu');
        this.telaGameOver = document.getElementById('tela-gameover');
        
        this.ultimoFrameTime = Date.now();
    }

    inicializar() {
        console.log("Inicializado!");
        this.entidades.init();
        this.spawner = new ControladorDeSpawn(this.entidades);
        this.mudarTela('menu');
    }

    mudarTela(novaTela) {
        this.telaAtual = novaTela;
        console.log(`Mudança de tela para -> ${this.telaAtual}`);

        // Oculta todas as telas de overlay por padrão
        if (this.telaMenu) this.telaMenu.style.display = 'none';
        if (this.telaGameOver) this.telaGameOver.style.display = 'none';

        if (this.telaAtual === 'jogando') {
            this.jogoRodando = true; // Libera o jogo
            this.iniciarLoop();
        } else {
            this.jogoRodando = false; // Trava o jogo
            this.pararLoop();
            
            // Mostra a tela correta dependendo do estado
            if (this.telaAtual === 'menu' && this.telaMenu) {
                this.telaMenu.style.display = 'flex';
            } else if (this.telaAtual === 'gameover' && this.telaGameOver) {
                this.telaGameOver.style.display = 'flex';
            }
        }
    }

    iniciarLoop() {
        if (this.loopId) this.pararLoop();

        this.ultimoFrameTime = Date.now(); 

        const frameDoJogo = () => {
            if (!this.jogoRodando) return;

            const agora = Date.now();
            const deltaTime = (agora - this.ultimoFrameTime) / 1000; // em segundos
            this.ultimoFrameTime = agora;

            // Chama o spawner dentro do loop
            if (this.spawner) this.spawner.update(deltaTime);

            // Update de todos os vegetais
            this.entidades.vegetaisdoJogo.forEach(veg => {
                veg.update(deltaTime);
            });

            // Update de todos os obstáculos
            this.entidades.obstaculosdoJogo.forEach(obs => {
                obs.update(deltaTime);
            });

            // Render de todos os vegetais
            this.entidades.vegetaisdoJogo.forEach(veg => {
                veg.render();
            });

            // Render de todos os obstáculos do jogo
            this.entidades.obstaculosdoJogo.forEach(obs => {
                obs.render();
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

    // //modificado
    // vegetalFoiCortado(vegetal){

    //     console.log("Motor recebeu:", vegetal);

    //     vegetal.despawn();
    // }
}