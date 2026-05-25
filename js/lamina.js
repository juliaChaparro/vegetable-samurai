class Lamina {
    constructor() {
        this.posicaoAtualX = 0;
        this.posicaoAtualY = 0;
        this.posicaoAnteriorX = 0;
        this.posicaoAnteriorY=0;
        this.estaCortando = false;

        document.addEventListener("mousemove", (evento) =>{
            this.atualizarPosicaoMouse(evento);
            
             if(this.estaCortando){
                this.desenharRastro();
            }
            
        });

        document.addEventListener("mousedown", (evento) => {
            this.atualizarPosicaoMouse(evento);
            this.estaCortando = true;
        });

        document.addEventListener("mouseup", (evento) => {
            this.atualizarPosicaoMouse(evento);
            this.estaCortando = false;
        });
    }

    atualizarPosicaoMouse(evento){
        this.posicaoAnteriorX = this.posicaoAtualX;
        this.posicaoAnteriorY = this.posicaoAtualY;

        this.posicaoAtualX = evento.pageX;
        this.posicaoAtualY = evento.pageY;

        console.log(`Posiçao Atual X:${this.posicaoAtualX}`);
        console.log(`Posiçao Atual Y:${this.posicaoAtualY}`);
        console.log(`Posicao Anterior X: ${this.posicaoAnteriorX}`);
        console.log(`Posiçao Anterior Y:${this.posicaoAnteriorY}`);
    }


    calcularDistanciaPontos(evento){
        const dx = this.posicaoAtualX - this.posicaoAnteriorX;
        const dy = this.posicaoAtualY - this.posicaoAnteriorY;
        return Math.hypot(dx, dy);  // Retorna a distância em linha reta
    }

    calcularAngulo(){
        const dx = this.posicaoAtualX - this.posicaoAnteriorX;
        const dy = this.posicaoAtualY - this.posicaoAnteriorY;
        return Math.atan2(dy, dx); //Retorna o angulo 
    }

    desenharRastro(){
        const linha = document.createElement("div");

        linha.classList.add("corte");
        const distancia = this.calcularDistanciaPontos();

        const angulo = this.calcularAngulo();

        // posição inicial
        linha.style.left = this.posicaoAnteriorX + "px";

        linha.style.top = this.posicaoAnteriorY + "px";

        // tamanho da linha
        linha.style.width = distancia + "px";

        // rotação
        linha.style.transform = `rotate(${angulo}rad)`;

        document.body.appendChild(linha);

        // remove depois de um tempo
        setTimeout(() => {
            linha.remove();
        }, 300);
    }

}

const mouse = new Lamina();

