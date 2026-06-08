// =============================================================
// colisao.js — Colisao
// Responsável: Membro 2
// Modificado: Membro 4 adicionou break após colisão detectada
//             para evitar múltiplos cortes no mesmo frame
// =============================================================

export class Colisao {
  constructor() {}

  /**
   * @brief Verifica se o rastro da lâmina tocou alguma entidade ativa.
   * Quando detecta colisão, chama despawn('corte') na entidade —
   * cada subclasse (Vegetal, Bomba, Madeira) cuida do resto.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  verificarColisaoRastro(x1, y1, x2, y2) {
    const entidades = document.querySelectorAll(".entidadeDoJogo");

    for (const entidade of entidades) {
      const obj = entidade.entidadeReferencia;

      if (!obj.ativo || obj.cortado) continue;

      const rect = entidade.getBoundingClientRect();
      const distancia = Math.hypot(x2 - x1, y2 - y1);
      const passos = Math.ceil(distancia / 5);

      for (let i = 0; i <= passos; i++) {
        const t = i / passos;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        const colidiu =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;

        if (colidiu) {
          obj.cortado = true;
          obj.despawn("corte"); // Vegetal, Bomba ou Madeira tratam cada um do seu lado
          // console.log("[Colisao] Atingido:", obj.name);
          break; // evita detectar a mesma entidade múltiplas vezes no mesmo rastro
        }
      }
    }
  }
}
