// =============================================================
// vegetal.js — Vegetal
// Responsável: Membro 3
// Modificado: Membro 4 conectou despawn('corte') ao Juiz
//             e despawn('normal') a registrarFrutaPerdida()
// =============================================================
import { EntidadeBase } from "./entidadeBase.js";
import { Juiz } from "./score.js";

export class Vegetal extends EntidadeBase {
  /**
   * @brief Classe específica para representar as frutas/vegetais que dão pontos.
   * @param {string} nome Nome do arquivo SVG (ex: 'tomate')
   */
  constructor(nome = "tomate") {
    super(nome, 500);
    this.sprite.classList.add("vegetal");
  }

  /**
   * @brief Desativa o vegetal e notifica o Juiz.
   * @param {string} tipo 'normal' (caiu da tela) ou 'corte' (passou a lâmina)
   */
  despawn(tipo = "normal") {
    // Captura a posição do sprite ANTES de esconder (super vai esconder)
    const rect = this.sprite.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    super.despawn(tipo);

    if (tipo === "corte") {
      console.log(`🍉 SUCO DE ${this.name.toUpperCase()}!`);
      Juiz.vegetalFoiCortado(this, cx, cy);
    } else {
      console.log(`❌ ${this.name} caiu no chão!`);
      Juiz.registrarFrutaPerdida();
    }
  }
}
