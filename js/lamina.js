class Lamina {
    constructor() {
        this.posicaoAtualX = 0;
        this.posicaoAtualY = 0;
        this.posicaoAnteriorX = 0;
        this.posicaoAnteriorY=0;
        this.estaCortando = false;

        document.addEventListener("mousemove", (evento) =>{
            this.atualizarPosicaoMouse(evento);
            
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
}
