import { Vegetable } from './vegetable.js';
import { EntidadesDoJogo } from './entidades.js';
import { Utils } from './utils.js';

export class ControladorDeSpawn {
    constructor(entidades) {
        this.entidades = entidades;
    }

    lancarVegetalUnico() {
        let vegetal = this.entidades.obterVegetalInativo();

        // Calcula os limites da tela
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;

        let posX = Utils.randomIntExclusivo(50, limiteTelaX - vegetal.tam);
        let posY = limiteTelaY;
        let angulo = Utils.randomFloatExclusivo(55, 70);
        if (posX > limiteTelaX / 2) {
            angulo = 180 - angulo;
        }
        vegetal.spawn(posX, posY);
        vegetal.arremessar(angulo, Utils.randomFloatExclusivo(700, 900));
        console.log(`Spawnado ${vegetal.name} na posição (${posX}, ${posY})`);
    }

    lancarVegetaisSequencia(quantidade) {
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;
        const posY = limiteTelaY;


        const espacamento = 60;

        let baseX = Utils.randomIntExclusivo(50, limiteTelaX - (quantidade * espacamento) - 80);
        let angulo = Utils.randomFloatExclusivo(55, 70);

        // Todos os vegetais da sequência precisam ter a mesma força para manter a formação
        let forca = Utils.randomFloatExclusivo(700, 900);

        let direcaoX = 1;
        if (baseX > limiteTelaX / 2) {
            angulo = 180 - angulo;
            direcaoX = -1;
        }


        for (let i = 0; i < quantidade; i++) {
            let vegetal = this.entidades.obterVegetalInativo();


            if (!vegetal) {
                console.warn("Faltou vegetal na garagem para completar a sequência!");
                break;
            }

            // Cada vegetal fica espacamento pixels ao lado do anterior
            let posX = baseX + (i * espacamento * direcaoX);

            vegetal.spawn(posX, posY);
            vegetal.arremessar(angulo, forca);
        }

        console.log(`Lançada sequência de ${quantidade} itens!`);
    }

    lancarVegetalEspelhado() {
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;
        const posY = limiteTelaY;
        let angulo1 = Utils.randomFloatExclusivo(55, 70);
        let angulo2 = 180 - angulo1;
        let posX1 = Utils.randomIntExclusivo(80, (limiteTelaX /2));
        let posX2 = Math.abs(limiteTelaX - posX1);
        let vegetal1 = this.entidades.obterVegetalInativo();
        vegetal1.spawn(posX1, posY);

        // if (!vegetal1 || !vegetal2) {
        //     console.warn("Faltou vegetal na garagem para completar o spawn espelhado!");
        //     return;
        // }
        

        let vegetal2 = this.entidades.obterVegetalInativo();
        vegetal2.spawn(posX2, posY);

        vegetal1.arremessar(angulo1, Utils.randomFloatExclusivo(700, 900));
        vegetal2.arremessar(angulo2, Utils.randomFloatExclusivo(700, 900));
        console.log(`Lançados vegetais espelhados nas posições (${posX1}, ${posY}) e (${posX2}, ${posY})`);

    }
}