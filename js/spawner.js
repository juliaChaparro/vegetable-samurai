import { EntidadesDoJogo } from './entidades.js';
import { Utils } from './utils.js';
import { Juiz } from './score.js';

export class ControladorDeSpawn {
    constructor(entidades) {
        this.entidades = entidades;
    }

    lancarEntidadeUnica(categoria = 'vegetal') {
        let entidade = this.entidades.obterInativo(categoria);
        if (!entidade) return;

        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;

        let posX = Utils.randomIntExclusivo(50, limiteTelaX - entidade.tam);
        let posY = limiteTelaY;
        let angulo = Utils.randomFloatExclusivo(55, 70);
        
        if (posX > limiteTelaX / 2) {
            angulo = 180 - angulo;
        }
        
        entidade.spawn(posX, posY);
        entidade.arremessar(angulo, Utils.randomFloatExclusivo(700, 900));

        Juiz.tocarSom("arremessar");
        // console.log(`Spawnado ${entidade.name} na posição (${posX}, ${posY})`);
    }

    lancarEntidadeSequencia(quantidade, categoria = 'vegetal') {
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;
        const posY = limiteTelaY;

        const espacamento = 60;

        let baseX = Utils.randomIntExclusivo(50, limiteTelaX - (quantidade * espacamento) - 80);
        let angulo = Utils.randomFloatExclusivo(55, 70);
        let forca = Utils.randomFloatExclusivo(700, 900);

        let direcaoX = 1;
        if (baseX > limiteTelaX / 2) {
            angulo = 180 - angulo;
            direcaoX = -1;
        }

        for (let i = 0; i < quantidade; i++) {
            let entidade = this.entidades.obterInativo(categoria);

            if (!entidade) {
                console.warn(`Faltou entidade na garagem para completar a sequência!`);
                break;
            }

            let posX = baseX + (i * espacamento * direcaoX);

            entidade.spawn(posX, posY);
            entidade.arremessar(angulo, forca);
        }
        Juiz.tocarSom("arremessar");    
        // console.log(`Lançada sequência de ${quantidade} itens da categoria: ${categoria}!`);
    }

    lancarEntidadeEspelhada(categoria = 'vegetal') {
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;
        const posY = limiteTelaY;
        
        let angulo1 = Utils.randomFloatExclusivo(55, 70);
        let angulo2 = 180 - angulo1;
        let posX1 = Utils.randomIntExclusivo(80, (limiteTelaX / 2));
        let posX2 = Math.abs(limiteTelaX - posX1);
        
        let entidade1 = this.entidades.obterInativo(categoria);
        if (!entidade1) return;
        entidade1.spawn(posX1, posY);

        let entidade2 = this.entidades.obterInativo(categoria);
        if (!entidade2) {
            // Se não houver 2ª entidade, lança só a 1ª
            entidade1.arremessar(angulo1, Utils.randomFloatExclusivo(700, 900));
            return;
        }
        entidade2.spawn(posX2, posY);

        entidade1.arremessar(angulo1, Utils.randomFloatExclusivo(700, 900));
        entidade2.arremessar(angulo2, Utils.randomFloatExclusivo(700, 900));

        Juiz.tocarSom("arremessar");
        // console.log(`Lançadas entidades espelhadas nas posições (${posX1}, ${posY}) e (${posX2}, ${posY})`);
    }
}