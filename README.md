# 🥦 Vegetable Samurai

> Jogo de browser inspirado em Fruit Ninja, desenvolvido com JavaScript puro (ES Modules), HTML5 e CSS3 como trabalho prático da disciplina de Programação Web.

---

## 🎮 Descrição do Jogo

Vegetable Samurai é um jogo de ação onde o jogador controla uma **lâmina invisível** movida pelo mouse para cortar vegetais que sobem pela tela. O objetivo é acumular a maior pontuação possível sem perder todas as vidas.

### Como jogar

- **Segure o botão esquerdo do mouse** e arraste para criar a lâmina
- **Corte os vegetais** que sobem pela tela para ganhar pontos
- **Não deixe vegetais caírem** no chão — cada um perdido custa uma vida
- **Evite a bomba** — cortá-la encerra o jogo imediatamente
- **Corte a madeira** — não custa vida, mas zera seu combo
- **Combos**: cortar 3 ou mais vegetais em sequência rápida concede pontos bônus

### Vegetais e pontuações

| Vegetal                                                                      | Pontos      |
| ---------------------------------------------------------------------------- | ----------- |
| Abóbora 🎃 _(especial)_                                                      | 50 pts      |
| Melancia                                                                     | 20 pts      |
| Tomate, Cenoura, Cebola, Berinjela, Batata, Brócolis, Pimentão, Repolho Roxo | 10 pts cada |

### Obstáculos

| Obstáculo  | Efeito             |
| ---------- | ------------------ |
| 💣 Bomba   | Game Over imediato |
| 🪵 Madeira | Zera o combo atual |

### Sistema de dificuldade

O jogo possui um **Diretor de Dificuldade** que ajusta automaticamente o ritmo conforme o tempo de partida:

| Fase            | Tempo   | Característica                           |
| --------------- | ------- | ---------------------------------------- |
| 0 — Calma       | 0–20s   | Vegetais únicos, poucas bombas           |
| 1 — Aquecimento | 20–45s  | Sequências e pares espelhados            |
| 2 — Pressão     | 45–75s  | Obstáculos embutidos nas sequências      |
| 3 — Frenesi     | 75–110s | Sequências longas, bombas espelhadas     |
| 4 — Inferno     | 110s+   | Máxima densidade, obstáculos simultâneos |

---

## 🚀 Instruções de Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (qualquer versão LTS)
- [Git](https://git-scm.com/) instalado

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/juliaChaparro/vegetable-samurai.git
```

**2. Acesse a pasta do projeto**

```bash
cd vegetable-samurai
```

> O projeto deve ser clonado a partir da branch `main`.

**3. Inicie o servidor local**

```bash
npx live-server
```

> O comando `npx live-server` não requer instalação prévia — o `npx` baixa e executa automaticamente.  
> O jogo abrirá no navegador em `http://127.0.0.1:8080` (ou porta similar indicada no terminal).

**4. Modo de desenvolvimento (opcional)**

Para ativar ferramentas de debug — botão de teste de corte e atalhos de teclado:

```
http://127.0.0.1:8080/?debug
```

| Tecla | Ação                                             |
| ----- | ------------------------------------------------ |
| `A`   | Spawna um vegetal aleatório em posição aleatória |
| `D`   | Despawna todos os vegetais da tela               |
| `J`   | Lança um obstáculo único                         |
| `K`   | Lança uma sequência de 3 vegetais                |
| `L`   | Lança dois vegetais espelhados                   |

---

## 🏗️ Arquitetura do Projeto

```
vegetable-samurai/
├── index.html              # Estrutura principal e HUD
├── css/
│   └── style.css           # Estilos, animações e variáveis visuais
├── js/
│   ├── main.js             # Ponto de entrada — inicializa todos os módulos
│   ├── config.js           # Estado global do jogo (pontuação, vidas)
│   ├── entidadeBase.js     # Classe base abstrata para todos os objetos do jogo
│   ├── vegetal.js          # Classe dos vegetais cortáveis
│   ├── bomba.js            # Classe da bomba (obstáculo letal)
│   ├── madeira.js          # Classe da madeira (zera combo)
│   ├── entidades.js        # Pool de entidades (object pooling)
│   ├── spawner.js          # Controlador de spawn (lançamentos)
│   ├── diretor.js          # Diretor de dificuldade progressiva
│   ├── lamina.js           # Lâmina do mouse (rastro + trigonometria)
│   ├── colisao.js          # Detecção de colisão lâmina × entidade
│   ├── game.js             # Motor do jogo (game loop, telas, botões)
│   ├── score.js            # Juiz (pontuação, HUD, combos, best score)
│   ├── particulas.js       # Efeitos visuais (split, splash, explosão)
│   └── sfx.js              # Gerenciador de efeitos sonoros
└── assets/
    ├── background/         # Imagens de fundo e botões SVG
    ├── Vegetais_SVG/       # Sprites dos vegetais (inteiros e metades)
    ├── sfx/                # Efeitos sonoros (.mp3)
    ├── Moeda_vida.svg      # Ícone de vida ativa
    └── Moeda_vida_perdida.svg
```

---

## 👥 Divisão de Responsabilidades

A divisão detalhada de cada issue resolvido por cada membro pode ser consultada diretamente na aba **Issues** do repositório no GitHub:

🔗 [github.com/juliaChaparro/vegetable-samurai/issues](https://github.com/juliaChaparro/vegetable-samurai/issues)

Abaixo um resumo das áreas de atuação de cada integrante:

### Membro 1 — Motor do Jogo e Interface

- Estrutura do `MotorDoJogo` (`game.js`): game loop, controle de telas, botões cortáveis
- Telas de Menu e Game Over com navegação via lâmina
- Diretor de Dificuldade (`diretor.js`): progressão automática de fases
- Integração geral dos módulos e arquivo `main.js`

### Membro 2 — Lâmina e Colisão

- Sistema de rastro do mouse (`lamina.js`): trigonometria, animação e pool de divs
- Detecção de colisão por interpolação linear (`colisao.js`)
- Eventos de mouse (`mousedown`, `mousemove`, `mouseup`)

### Membro 3 — Entidades e Física

- Classe base abstrata `EntidadeBase` com física parabólica e gravidade
- Classes `Vegetal`, `Bomba` e `Madeira` com comportamentos específicos
- Pool de entidades (`entidades.js`) e sistema de spawn (`spawner.js`)
- Integração das entidades com o game loop

### Membro 4 — Pontuação, Efeitos e Áudio

- Objeto `Juiz` (`score.js`): HUD, pontuação, combos e Best Score com `localStorage`
- Efeitos visuais (`particulas.js`): Split (metades ao cortar), Splash (partículas de suco) e Explosão (bomba)
- Gerenciador de SFX (`sfx.js`): carregamento e disparo de efeitos sonoros
- Integração do sistema de pontuação com o fluxo de colisão e game over

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — estrutura e canvas DOM
- **CSS3** — animações, clip-path, variáveis CSS
- **JavaScript ES2022** — ES Modules, Classes, CustomEvents, localStorage, Web Audio API
- **Live Server** — servidor de desenvolvimento local

---

## 📝 Observações

- O jogo utiliza **ES Modules** (`type="module"`), portanto **não funciona abrindo o `index.html` diretamente** no navegador — é necessário um servidor local (como o `live-server`).
- Os arquivos de áudio (`corte.mp3`, `bomba.mp3`, `combo.mp3`) devem estar em `assets/sfx/`. Sem eles o jogo funciona normalmente, apenas sem som.
- Testado nos navegadores Google Chrome e Microsoft Edge (versões modernas).
