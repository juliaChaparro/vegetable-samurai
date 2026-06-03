import { EntidadeBase } from "./entidadeBase.js";

export class Colisao {

    constructor(){

    }
    
    verificarColisaoRastro(x1, y1, x2, y2){

        // Buscando pela classe genérica.
        const entidades = document.querySelectorAll(".entidadeDoJogo");

        for(const entidade of entidades){

            const obj = entidade.entidadeReferencia;

            if(!obj.ativo || obj.cortado){
                continue;
            }

            const rect = entidade.getBoundingClientRect();

            const distancia = Math.hypot(x2 - x1, y2 - y1);

            const passos = Math.ceil(distancia / 5);

            for(let i = 0; i <= passos; i++){

                const t = i / passos;

                const x = x1 + (x2 - x1) * t;

                const y = y1 + (y2 - y1) * t;

                const colidiu =
                    x >= rect.left &&
                    x <= rect.right &&
                    y >= rect.top &&
                    y <= rect.bottom;

               if(colidiu){
                    entidade.entidadeReferencia.cortado = true;
                    entidade.entidadeReferencia.despawn('corte'); 
                    console.log("Colisão detectada com:", entidade.entidadeReferencia.name);
                }
            }
        }
    }
}