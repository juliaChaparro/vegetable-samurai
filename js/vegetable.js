class vegetable {
    
    /**
     * @abstract Classe base para representar um vegetal no jogo.
     * @param {Nome do Vegetal} name 
     * @param {Força de Gravidade relativa ao Vegetal} GRAVITY 
     */
    constructor(name, GRAVITY) {
        this.name = name;
        this.positionX = 0;
        this.positionY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.GRAVITY = GRAVITY;

        this.limiteTela;

        this.sprite = new Image();
        this.sprite.src = `./assets/${this.name}_inteira.png`;
        this.sprite.style.display = 'none';
        this.ativo = false;
        this.sprite.appendChild(document.getElementById('game'));
    }

    /**
     * @brief Posiciona o vegetal na tela e o torna ativo.
     * @param {*Posição X do vegetal} positionX 
     * @param {*Posição Y do vegetal} positionY 
     */
    spawn(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.ativo = true;
        this.sprite.style.display = 'block';

        const alturaTela = document.getElementById('game').clientHeight;
        this.limiteTela = alturaTela - this.sprite.height;
    }

    /**
     * @brief Desativa o vegetal e o remove da tela.
     */
    despawn(){
        this.ativo = false;
        this.sprite.style.display = 'none';
    }

    /**
     * @brief Arremessa o vegetal com uma determinada força e ângulo.
     * @param {*Ângulo do arremesso em graus} anguloGraus 
     * @param {*Força total do arremesso} forcaTotal 
     */
    arremessar(anguloGraus, forcaTotal) {
        const radianos = anguloGraus * (Math.PI / 180);
        this.velocityX = Math.cos(radianos) * forcaTotal;
        this.velocityY = -Math.sin(radianos) * forcaTotal;
    }

    /**
     * @brief Atualiza a posição do vegetal com base na física de movimento e gravidade.
     * @param {*Tempo decorrido desde a última atualização} deltaTime
     */
    update(deltaTime) {
        if (this.ativo) {
            this.velocityY += (this.GRAVITY * deltaTime);
            this.positionX += (this.velocityX * deltaTime);
            this.positionY += (this.velocityY * deltaTime);
            if(this.positionY >= this.limiteTela) {
                this.despawn();
            }
        }
    }

    /*
     * @brief Renderiza o vegetal na tela.
     */
    render() {
        if (!this.ativo) return;
        this.sprite.style.transform = `translate(${this.positionX}px, ${this.positionY}px)`;
    }
}