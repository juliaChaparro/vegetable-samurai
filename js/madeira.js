// =============================================================
// madeira.js — Madeira
// Responsável: Membro 3
// Modificado: Membro 4 conectou despawn('corte') a Juiz.zerarCombo()
// =============================================================
import { EntidadeBase } from "./entidadeBase.js";
import { Juiz } from "./score.js";

export class Madeira extends EntidadeBase {
  constructor(nome = "madeira") {
    // Gravidade intermediária (600), tamanho 150
    super(nome, 600, 150);
    this.sprite.classList.add("obstaculo", "madeira");
  }

  /**
   * @brief Desativa a madeira. Se for por corte, zera o combo do Juiz.
   * @param {string} tipo 'normal' ou 'corte'
   */
  despawn(tipo = "normal") {
    super.despawn(tipo);

    if (tipo === "corte") {
      console.log(`🪵 TOC! Você cortou a ${this.name}! COMBO ZERADO!`);
      Juiz.zerarCombo();
    }
  }
}
