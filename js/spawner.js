import { Vegetable } from './vegetable.js';
import { EntidadesDoJogo } from './entidades.js';
import { Utils } from './utils.js';

export class ControladorDeSpawn{
    constructor(entidades) {
        this.entidades = entidades;
        this.spawnInterval = 1500;
        this.spawnTimer = 0;
    }

    lancarVegetalUnico(deltaTime) {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            let vegetal = this.entidades.obterVegetalInativo();
            let posX = Utils.randomFloatExclusivo(50, vegetal.limiteTelaX - vegetal.tam);
            vegetal.spawn(posX, vegetal.limiteTelaY);
            vegetal.arremessar(55, 1500);
        }
    }
}