export class EntidadeBase {

    /**
     * @abstract Classe base genérica para representar uma entidade no jogo.
     * @param {number} GRAVITY Força de Gravidade relativa à Entidade
     */
    constructor(nome = 'tomate', GRAVITY = 500, tam=80) {
        this.name = nome;
        this.tam = tam;  //tamanho base (80px)
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
        this.sprite.src = `./assets/Vegetais_SVG/${nome}_i.svg`;
        this.ativo = false;
        this.sprite.style.position = 'absolute';
        this.sprite.style.left = '0px';
        this.sprite.style.top = '0px';
        this.sprite.style.display = 'none';
        this.sprite.style.width = this.tam + 'px';
        this.sprite.style.transformOrigin = 'center center';
        document.getElementById('game').appendChild(this.sprite);
        
        // --- MODIFICAÇÕES DA REFATORAÇÃO GENÉRICA ---
        this.sprite.classList.add("entidadeDoJogo");
        
        // Mudei de 'vegetalReferencia' para 'entidadeReferencia'
        this.sprite.entidadeReferencia = this; 
        this.cortado = false;
    }

    /**
     * @brief Define o sprite da entidade com base no nome fornecido.
     * @param {string} nomeEntidade Nome do arquivo SVG
     */
    definirSprite(nomeEntidade = 'tomate') {
        this.name = nomeEntidade;
        this.sprite.src = `./assets/Vegetais_SVG/${nomeEntidade}_i.svg`;
    }

    /**
     * @brief Posiciona a entidade na tela e a torna ativa.
     * @param {number} positionX 
     * @param {number} positionY 
     */
    spawn(positionX, positionY) {
        console.log(`Spawnando ${this.name} na posição (${positionX}, ${positionY})`);
        this.positionX = positionX;
        this.positionY = positionY;
        this.rotation = 0;

        // Aplica o transform ANTES de exibir o sprite, evitando o frame
        // em que ele apareceria na posição antiga (causa da "piscada").
        this.sprite.style.transform = `translate(${positionX}px, ${positionY}px) rotate(0deg)`;

        this.ativo = true;
        this.sprite.style.display = 'block';

        this.cortado = false;

        const alturaTela = document.getElementById('game').clientHeight || window.innerHeight;
        this.limiteTelaY = alturaTela - this.sprite.height;
        this.limiteTelaX = document.getElementById('game').clientWidth || window.innerWidth;
    }

    /**
     * @brief Desativa a entidade e a remove da tela.
     * @param {string} tipo Tipo de despawn, pode ser por sair do mapa ('normal') ou pela lâmina ('corte')
    */
    despawn(tipo = 'normal') {
        this.ativo = false;
        this.sprite.style.display = 'none';
        if (tipo === 'normal') {
            console.log(`Despawnando ${this.name} na posição (${this.positionX}, ${this.positionY})`);
        } else {
            //Adicionar depois função de emitir partículas.
            console.log(`Soltando Pedaços!!`);
        }
    }

    /**
     * @brief Arremessa a entidade com uma determinada força e ângulo.
     * @param {number} anguloGraus Ângulo do arremesso em graus
     * @param {number} forcaTotal Força total do arremesso
    */
    arremessar(anguloGraus, forcaTotal) {
        const radianos = anguloGraus * (Math.PI / 180);
        this.velocityX = Math.cos(radianos) * forcaTotal;
        this.velocityY = -Math.sin(radianos) * forcaTotal;
        this.rotationSpeed = (Math.random() - 0.5) * 720; // Rotação aleatória entre -360 e 360 graus por segundo
    }

    /**
    * @brief Ajusta o tamanho da entidade multiplicando pelo fator fornecido.
    * @param {number} factor Escala em que a entidade é aumentada/diminuida
    */
    sizeScale(factor) {
        this.sprite.style.width = `${this.tam * factor}px`;
        this.tam = this.tam * factor;
    }

    /**
     * @brief Atualiza a posição da entidade com base na física de movimento e gravidade.
     * @param {number} deltaTime Tempo decorrido desde a última atualização
    */
    update(deltaTime) {
        if (this.ativo) {
            this.velocityY += (this.GRAVITY * deltaTime);
            this.positionX += (this.velocityX * deltaTime);
            this.positionY += (this.velocityY * deltaTime);
            this.rotation += this.rotationSpeed * deltaTime;
            
            if ((this.velocityY >= 0 && this.positionY >= this.limiteTelaY + (this.tam + 10)) || (this.positionX >= this.limiteTelaX + (this.tam + 10)) || (this.positionX < - (this.tam + 10))) {
                this.despawn();
            }
        }
    }

    /*
     * @brief Renderiza a entidade na tela.
     */
    render() {
        if (!this.ativo) return;
        this.sprite.style.transform = `translate(${this.positionX}px, ${this.positionY}px) rotate(${this.rotation}deg)`;
    }
}