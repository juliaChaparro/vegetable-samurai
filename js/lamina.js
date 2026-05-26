class Lamina {

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

        // ignora movimentos muito pequenos
        if(distancia < 2){
            return;
        }

        // calcula direção do corte
        const angulo = this.calcularAngulo();

         // define posição inicial
        this.corte.style.left = this.posicaoAnteriorX + "px";

        this.corte.style.top = this.posicaoAnteriorY + "px";

         // aumenta largura conforme velocidade
        this.corte.style.width = (distancia * 2.5) + "px";

        // direção
        this.corte.style.transform = `rotate(${angulo}rad)`;

        // deixa visível
        this.corte.style.opacity = 1;

        // evita múltiplos timeouts
        clearTimeout(this.timeout);

        // faz desaparecer depois de 300ms
        this.timeout = setTimeout(() => {

            this.corte.style.opacity = 0;

        }, 300);
    }
}

new Lamina();