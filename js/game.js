import { EntidadesDoJogo } from './entidades.js';
import { ControladorDeSpawn } from './spawner.js';
import { Utils } from './utils.js';
export class MotorDoJogo {
    constructor() {
        this.telaAtual = 'menu'; 
        this.loopId = null;      

        this.spawner;
        this.entidades = new EntidadesDoJogo();
        this.tabuleiro = document.getElementById('game');
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

        if (this.telaAtual === 'jogando') {
            this.iniciarLoop();
        } else {
            this.pararLoop();
        }
    }

    iniciarLoop() {
        if (this.loopId) this.pararLoop();

        const frameDoJogo = () => {
            const agora = Date.now();
            const deltaTime = (agora - this.ultimoFrameTime) / 1000; // em segundos
            this.ultimoFrameTime = agora;

            // Update de todos os vegetais
            this.entidades.vegetaisdoJogo.forEach(veg => {
                veg.update(deltaTime);
            });

            // // Update de todos os obstáculos
            // this.entidades.obstaculosdoJogo.forEach(obs => {
            //     obs.update(deltaTime);
            // });

            // Render de todos os vegetais
            this.entidades.vegetaisdoJogo.forEach(veg => {
                veg.render();
            });

            // // Render de todos os obstáculos do jogo
            // this.entidades.obstaculosdoJogo.forEach(obs => {
            //     obs.render();
            // });
                    
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