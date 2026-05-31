import { Vegetable } from './vegetable.js';
import { EntidadesDoJogo } from './entidades.js';
import { Utils } from './utils.js';

export class ControladorDeSpawn{
    constructor(entidades) {
        this.entidades = entidades;
        this.spawnInterval = 2;
        this.spawnTimer = 0;
    }

lancarVegetalUnico(deltaTime) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        let vegetal = this.entidades.obterVegetalInativo();
        
        // Calcula os limites da tela
        const limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
        const limiteTelaY = document.getElementById('game').clientHeight || window.innerHeight;
        
        // Posição X aleatória, posição Y no chão
        let posX = Utils.randomIntExclusivo(50, limiteTelaX - vegetal.tam);
        let posY = limiteTelaY - vegetal.tam; // No chão!
        
        vegetal.spawn(posX, posY);
        vegetal.arremessar(55, 700);
        console.log(`Spawnado ${vegetal.name} na posição (${posX}, ${posY})`);
    }
}
}