import { EntidadeBase } from './entidadeBase.js';

export class Bomba extends EntidadeBase {
    constructor(nome = 'bomba') {
        super(nome, 700, 250); 
        this.sprite.classList.add("obstaculo", "bomba");
    }

    despawn(tipo = 'normal', motorAtual = undefined) {
        super.despawn(tipo);

        if (tipo === 'corte') {
            console.log(`💥 KABOOM! Você cortou a ${this.name}! GAME OVER!`);
            window.dispatchEvent(new CustomEvent('bombaExplodiu'));
        } else {
            console.log(`✅ A ${this.name} caiu sem explodir.`);
        }
    }
}