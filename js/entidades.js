import { Vegetal } from './vegetal.js';
import { Bomba } from './bomba.js';
import { Madeira } from './madeira.js';
import { Utils } from './utils.js';

export class EntidadesDoJogo {
    constructor() {
        this.nomeVegetais = ['batata', 'berinjela', 'brocolis', 'cebola', 'cebolaroxa', 'pimentaoamarelo', 'pimentaovermelho', 'repolhoroxo', 'tomate'];
        this.nomeObstaculos = ['bomba', 'madeira'];
        
        this.vegetaisdoJogo = [];
        this.obstaculosdoJogo = [];
    }

    init() {
        
        for (let i = 0; i < 30; i++) {
            this.vegetaisdoJogo.push(new Vegetal(Utils.randomElemento(this.nomeVegetais)));
        }
        
        for (let i = 0; i < 15; i++) {
            let tipoSorteado = Utils.randomElemento(this.nomeObstaculos);
            
            if (tipoSorteado === 'bomba') {
                this.obstaculosdoJogo.push(new Bomba(tipoSorteado));
            } else {
                this.obstaculosdoJogo.push(new Madeira(tipoSorteado));
            }
        }
    }

    obterInativo(categoria = 'vegetal') {
        if (categoria === 'obstaculo') {
            return this.obstaculosdoJogo.find(obs => !obs.ativo);
        }
        return this.vegetaisdoJogo.find(veg => !veg.ativo);
    }

    get todasAtivas() {
        const ativos = [];
        for (let i = 0; i < this.vegetaisdoJogo.length; i++) {
            if (this.vegetaisdoJogo[i].ativo) ativos.push(this.vegetaisdoJogo[i]);
        }
        for (let i = 0; i < this.obstaculosdoJogo.length; i++) {
            if (this.obstaculosdoJogo[i].ativo) ativos.push(this.obstaculosdoJogo[i]);
        }
        return ativos;
    }
}