 export class Lamina {

    constructor(){
        // posição atual do mouse
        this.posicaoAtualX = 0;
        this.posicaoAtualY = 0;

        // posição anterior do mouse
        this.posicaoAnteriorX = 0;
        this.posicaoAnteriorY = 0;

        // verifica se o mouse está pressionado
        this.estaCortando = false;

        // pega a div do corte no HTML
        this.corte = document.getElementById("corte");

        // ARRAY DOS RASTROS
        this.rastros = [];

        // indici do rastro atual
        this.indiceRastro = 0;

        // criaçao dos 5 div
        for(let i = 0; i < 5; i++){
            const rastro = document.createElement("div");
            rastro.classList.add("rastro");
            document.body.appendChild(rastro);
            this.rastros.push(rastro);
        }

        // movimento do mouse
        document.addEventListener("mousemove",(evento)=>{
            this.atualizarPosicaoMouse(evento);
                if(this.estaCortando){
                    this.desenharRastro();
                }
            }
        );

        
         // quando pressiona o mouse
        document.addEventListener("mousedown",()=>{
                this.estaCortando = true;
            }
        );

        // quando solta o mouse
        document.addEventListener("mouseup",()=>{
            this.estaCortando = false;
            // esconde o corte
            this.corte.style.opacity = 0;
            }
        );
    }

    // atualiza posição atual e anterior do mouse
    atualizarPosicaoMouse(evento){
        this.posicaoAnteriorX = this.posicaoAtualX;
        this.posicaoAnteriorY = this.posicaoAtualY;
        this.posicaoAtualX = evento.pageX;
        this.posicaoAtualY = evento.pageY;
    }
    // calcula distância entre dois pontos
    calcularDistanciaPontos(){
        const dx = this.posicaoAtualX - this.posicaoAnteriorX;
        const dy = this.posicaoAtualY - this.posicaoAnteriorY;
        return Math.hypot(dx, dy);
    }
     // calcula ângulo da linha
    calcularAngulo(){
        const dx = this.posicaoAtualX - this.posicaoAnteriorX;
        const dy = this.posicaoAtualY - this.posicaoAnteriorY;
        return Math.atan2(dy, dx);
    }


    
     // desenha o rastro do corte
    desenharRastro(){

        // calcula tamanho do movimento
        const distancia = this.calcularDistanciaPontos();

        //pega os 5 div criados
        const rastro = this.rastros[this.indiceRastro];

        // ignora movimentos muito pequenos
        if(distancia < 5){
            return;
        }

        // calcula direção do corte
        const angulo = this.calcularAngulo();

        rastro.style.transition = "none";
        rastro.style.opacity = 0;

         // define posição inicial
        rastro.style.left = this.posicaoAnteriorX + "px";

        rastro.style.top = this.posicaoAnteriorY + "px";

        rastro.style.width = (distancia * 2.5) + "px";

        rastro.style.transform = `rotate(${angulo}rad)`;
        
        rastro.style.height = Math.min(distancia / 5, 12) + "px";

        rastro.offsetHeight;

        rastro.style.transition = "opacity 0.05s linear";

        rastro.style.opacity = 1;
        clearTimeout(rastro.timeout);

        // faz desaparecer depois de 100ms
        rastro.timeout = setTimeout(() => {

            rastro.style.opacity = 0;

        }, 100);

        
        // fica reutiçizando os div 
        this.indiceRastro++;

        if(this.indiceRastro >= 5){

            this.indiceRastro = 0;
        }
    }
}

