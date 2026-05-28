export class Colisao {

    constructor(){

    }
    verificarColisaoRastro(rastro){

        const vegetais = document.querySelectorAll(".vegetal");

        const rastroRect = rastro.getBoundingClientRect();

        for(const vegetal of vegetais){

            const vegetalRect = vegetal.getBoundingClientRect();

            const colidiu =
                rastroRect.left < vegetalRect.right &&
                rastroRect.right > vegetalRect.left &&
                rastroRect.top < vegetalRect.bottom &&
                rastroRect.bottom > vegetalRect.top;

           if(colidiu && !vegetal.cortado){
            vegetal.vegetalReferencia.cortado = true;
            return vegetal.vegetalReferencia;
            }
        }

        return null;
    }
}