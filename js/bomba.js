// =============================================================
// bomba.js — Bomba
// Responsável: Membro 3
// Modificado: Membro 4 passa as coordenadas no CustomEvent
//             para o Juiz criar a explosão no lugar certo
import { EntidadeBase } from "./entidadeBase.js";

export class Bomba extends EntidadeBase {
  constructor(nome = "bomba") {
    super(nome, 700, 120);
    this.sprite.classList.add("obstaculo", "bomba");
  }

  /**
   * @brief Desativa a bomba. Se for por corte, dispara o evento de Game Over.
   * O Juiz escuta 'bombaExplodiu' e executa a explosão + SFX + game over.
   * O MotorDoJogo escuta 'bombaExplodiu' e chama encerrarJogo().
   * @param {string} tipo 'normal' ou 'corte'
   */
  despawn(tipo = "normal") {
    // Captura posição antes do super esconder o sprite
    const rect = this.sprite.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    super.despawn(tipo);

    if (tipo === "corte") {
      // Passa as coordenadas no detail para o Juiz criar a explosão no lugar certo
      window.dispatchEvent(
        new CustomEvent("bombaExplodiu", {
          detail: { cx, cy },
        }),
      );
    }
  }
}
