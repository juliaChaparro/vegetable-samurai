import { EntidadeBase } from './entidadeBase.js';

export class Vegetal extends EntidadeBase {

    /**
     * @brief Classe específica para representar as frutas/vegetais que dão pontos.
     * @param {string} nome Nome do arquivo SVG (ex: 'tomate')
     */
    constructor(nome = 'tomate') {
        super(nome, 500);
        this.sprite.classList.add("vegetal");
    }

    /**
     * @brief Desativa o vegetal. Se for por corte, gera os efeitos e pontos específicos!
     * @param {string} tipo 'normal' (caiu da tela) ou 'corte' (passou a lâmina)
     */
    despawn(tipo = 'normal') {
        super.despawn(tipo);

        if (tipo === 'corte') {
            console.log(`🍉 SUCO DE ${this.name.toUpperCase()}! +${this.pontosBase} pontos!`);
        } else {
            console.log(`❌ ${this.name} caiu no chão! Perdeu vida?`);
        }
    }
}