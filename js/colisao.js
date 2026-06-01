import { Vegetable } from "./vegetable.js";


export class Colisao {

    constructor(){

    }
    verificarColisaoRastro(x1, y1, x2, y2){

    const vegetais = document.querySelectorAll(".vegetal");

    for(const vegetal of vegetais){

        const obj = vegetal.vegetalReferencia;

        if(!obj.ativo || obj.cortado){
            continue;
        }

        const rect = vegetal.getBoundingClientRect();

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
                vegetal.vegetalReferencia.cortado = true;
                vegetal.vegetalReferencia.despawn();
                console.log("Colisão detectada com:", vegetal.vegetalReferencia.name);
            }
        }
    }
}
} 