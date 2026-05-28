import { Vegetable } from "./vegetable.js";


export class Colisao {

    constructor(){

    }
    verificarColisaoRastro(mouseX, mouseY){

        const vegetais = document.querySelectorAll(".vegetal");

        for(const vegetal of vegetais){

            const vegetalObjeto = vegetal.vegetalReferencia;

            if(
                !vegetalObjeto.ativo || vegetalObjeto.cortado
            ){
                continue;
            }

            const rect = vegetal.getBoundingClientRect();

            const colidiu =
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom;

           if(colidiu && !vegetal.cortado){
                vegetal.vegetalReferencia.cortado = true;
                vegetal.vegetalReferencia.despawn();
                console.log("Colisão detectada com:", vegetal.vegetalReferencia.name);
            }
        }
    }
}