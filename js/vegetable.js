export class vegetable {
    
    /**
     * @abstract Classe base para representar um vegetal no jogo.
     * @param {Nome do Vegetal} name 
     * @param {Força de Gravidade relativa ao Vegetal} GRAVITY 
     */
    constructor(name, GRAVITY) {
        this.name = name;
        this.tam = 80;  //tamanho base do vegetal (80px)
        this.positionX = 0;
        this.positionY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.GRAVITY = GRAVITY;
        
        this.limiteTelaY;
        this.limiteTelaX;
        this.sprite = new Image();
        this.sprite.src = `./assets/Vegetais_SVG/${this.name}_i.svg`;
        this.ativo = false;
        
        this.sprite.style.position = 'absolute';
        this.sprite.style.left = '0px';
        this.sprite.style.top = '0px';
        this.sprite.style.display = 'none';
        this.sprite.style.width = this.tam + 'px'; 
        this.sprite.style.transformOrigin = 'center center';
        document.getElementById('game').appendChild(this.sprite);
    }

    /**
     * @brief Posiciona o vegetal na tela e o torna ativo.
     * @param {*Posição X do vegetal} positionX 
     * @param {*Posição Y do vegetal} positionY 
     */
    spawn(positionX, positionY) {
        console.log(`Spawnando ${this.name} na posição (${positionX}, ${positionY})`);
        this.positionX = positionX;
        this.positionY = positionY;
        this.ativo = true;
        this.sprite.style.display = 'block';
        
        const alturaTela = document.getElementById('game').clientHeight || window.innerHeight;
        this.limiteTelaY = alturaTela - this.sprite.height;
        this.limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
    }

    /**
     * @brief Ajusta o tamanho do vegetal multiplicando pelo fator fornecido.
     * @param {escala em que o vegetal é aumentado/diminuido} factor 
     */
    sizeScale(factor) {
        this.sprite.style.width = `${this.tam * factor}px`;
        this.tam = this.tam * factor;
    }
    
    /**
     * @brief Desativa o vegetal e o remove da tela.
    */
   despawn(){
       console.log(`Despawnando ${this.name} na posição (${this.positionX}, ${this.positionY})`);
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
        this.rotationSpeed = (Math.random() - 0.5) * 720; // Rotação aleatória entre -360 e 360 graus por segundo)
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
            this.rotation += this.rotationSpeed * deltaTime;
            if((this.velocityY >= 0 && this.positionY >= this.limiteTelaY + (this.tam + 10)) || (this.positionX >= this.limiteTelaX + (this.tam + 10)) || (this.positionX < - (this.tam + 10))){
                this.despawn();
            }
        }
    }

    /*
     * @brief Renderiza o vegetal na tela.
     */
    render() {
        if (!this.ativo) return;
        this.sprite.style.transform = `translate(${this.positionX}px, ${this.positionY}px) rotate(${this.rotation}deg)`;
    }
}