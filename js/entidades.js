import { Vegetable } from './vegetable.js';
import { Utils } from './utils.js';


export class EntidadesDoJogo {
    constructor() {
        this.nomeVegetais = ['batata', 'berinjela', 'brocolis', 'cebola', 'cebolaroxa', 'pimentaoamarelo', 'pimentaovermelho', 'repolhoroxo', 'tomate'];
        this.nomeObstaculos = ['bomba', 'madeira'];
        this.vegetaisdoJogo = [];
        this.obstaculosdoJogo = [];
    }

    init(){
        for(let i = 0; i < 30;i++){
            let vegetal = new Vegetable(Utils.randomElemento(this.nomeVegetais));
            this.vegetaisdoJogo.push(vegetal);
        }
        // for(let i = 0; i < 30; i++){
        //     let obstaculo = new Obstaculo(Utils.randomElemento(this.nomeObstaculos));
        //     this.obstaculosdoJogo.push(obstaculo);
        // }
    }

    obterVegetalInativo(){
        return this.vegetaisdoJogo.find(veg => !veg.ativo);
    }

    obterObstaculoInativo(){
        return this.obstaculosdoJogo.find(obs => !obs.ativo);
    }
}