class MotorDoJogo {
    constructor() {
        this.telaAtual = 'menu'; 
        this.loopId = null;      

        this.listaDeInimigosAtivos = []; 
        
        this.tabuleiro = document.getElementById('game');
    }

    inicializar() {
        console.log("Inicializado!");
        this.mudarTela('menu');
    }

    mudarTela(novaTela) {
        this.telaAtual = novaTela;
        console.log(`Mudança de tela para -> ${this.telaAtual}`);

        if (this.telaAtual === 'jogando') {
            this.iniciarLoop();
        } else {
            this.pararLoop();
        }
    }

    iniciarLoop() {
        if (this.loopId) this.pararLoop();

        const frameDoJogo = () => {
                    
            this.loopId = requestAnimationFrame(frameDoJogo);
        };

        this.loopId = requestAnimationFrame(frameDoJogo);
    }

    pararLoop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId); 
            this.loopId = null;
            console.log("Loop pausado/parado.");
        }
    }
}

const motor = new MotorDoJogo();
motor.inicializar();