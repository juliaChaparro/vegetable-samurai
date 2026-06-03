import { EntidadeBase } from './entidadeBase.js';

export class Madeira extends EntidadeBase {
    constructor(nome = 'madeira') {
        // Gravidade intermediária (600)
        super(nome, 600);
        this.sprite.classList.add("obstaculo", "madeira");
    }

    despawn(tipo = 'normal') {
        super.despawn(tipo);

        if (tipo === 'corte') {
            console.log(`🪵 TOC! Você cortou a ${this.name}! COMBO CANCELADO!`);
            // Aqui você chamará a função do Juiz para zerar o multiplicador de combo
            // Ex: Juiz.zerarCombo();
        }
    }
}