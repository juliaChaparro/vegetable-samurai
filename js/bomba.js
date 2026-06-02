import { EntidadeBase } from './entidadeBase.js';

export class Bomba extends EntidadeBase {
    constructor(nome = 'bomba') {
        // Gravidade um pouco maior (700) para cair mais rápido
        super(nome, 700); 
        this.sprite.classList.add("obstaculo", "bomba");
    }

    despawn(tipo = 'normal') {
        super.despawn(tipo);

        if (tipo === 'corte') {
            console.log(`💥 KABOOM! Você cortou a ${this.name}! GAME OVER!`);
            // Aqui você chamará a função do motor/juiz para encerrar o jogo
            // Ex: this.motorDoJogo.encerrarJogo();
        } else {
            console.log(`✅ A ${this.name} caiu sem explodir.`);
        }
    }
}