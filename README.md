# 🥦 Vegetable Samurai

> Trabalho Prático da disciplina de Programação Web — UFAM.
> O projeto é composto por duas partes: um jogo de browser desenvolvido com JavaScript puro, e uma aplicação web com Express + TypeScript que permite aos usuários criar conta, fazer login e jogar, além de exibir um ranking com as maiores pontuações.

---

## 🎮 Parte 1 — O Jogo

Vegetable Samurai é um jogo de ação onde o jogador controla uma **lâmina invisível** movida pelo mouse para cortar vegetais que sobem pela tela. O objetivo é acumular a maior pontuação possível sem perder todas as vidas.

### Como jogar

- **Segure o botão esquerdo do mouse** e arraste para criar a lâmina
- **Corte os vegetais** que sobem pela tela para ganhar pontos
- **Não deixe vegetais caírem** no chão — cada um perdido custa uma vida
- **Evite a bomba** — cortá-la encerra o jogo imediatamente
- **Corte a madeira** — não custa vida, mas zera seu combo
- **Combos**: cortar 3 ou mais vegetais em sequência rápida concede pontos bônus

### Vegetais e pontuações

| Vegetal | Pontos |
|---|---|
| Melancia | 20 pts |
| Tomate, Cebola, Berinjela, Batata, Brócolis, Pimentão, Repolho Roxo | 10 pts cada |

### Obstáculos

| Obstáculo | Efeito |
|---|---|
| 💣 Bomba | Game Over imediato |
| 🪵 Madeira | Zera o combo atual |

### Sistema de dificuldade

O jogo possui um **Diretor de Dificuldade** que ajusta automaticamente o ritmo conforme o tempo de partida:

| Fase | Tempo | Característica |
|---|---|---|
| 0 — Calma | 0–20s | Vegetais únicos, poucas bombas |
| 1 — Aquecimento | 20–45s | Sequências e pares espelhados |
| 2 — Pressão | 45–75s | Obstáculos embutidos nas sequências |
| 3 — Frenesi | 75–110s | Sequências longas, bombas espelhadas |
| 4 — Inferno | 110s+ | Máxima densidade, obstáculos simultâneos |

---

## 🌐 Parte 2 — Aplicação Web

A segunda parte integra o jogo a uma aplicação web completa desenvolvida com **Express + TypeScript**. A aplicação permite que qualquer usuário crie uma conta, faça login e acesse o jogo. Ao terminar uma partida, a pontuação é salva automaticamente no banco de dados e exibida em uma página de ranking.

### Funcionalidades

- Cadastro e login de usuários com senha criptografada
- Acesso ao jogo restrito a usuários autenticados
- Salvamento automático de pontuações ao fim de cada partida
- Página de ranking com os 10 melhores jogadores
- CRUD de cursos (Majors) com exclusão via modal Ajax
- Página Sobre descrevendo o jogo

---

## 🚀 Instruções de Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (qualquer versão LTS)
- [Git](https://git-scm.com/) instalado
- Banco de dados MySQL disponível

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/juliaChaparro/vegetable-samurai.git
```

**2. Acesse a pasta do projeto**

```bash
cd vegetable-samurai/ExpTs
```

> Certifique-se de estar na branch `main`.

**3. Instale as dependências**

```bash
npm install
```

**4. Configure as variáveis de ambiente**

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env-example .env
```

Edite o `.env` com seus dados:

```env
PORT=3000
DATABASE_URL="mysql://usuario:senha@localhost:3306/vegetable_samurai"
LOGS_PATH="./logs/app.log"
SESSION_SECRET="sua-chave-secreta"
```

**5. Rode as migrations do banco**

```bash
npx prisma migrate deploy
```

**6. Inicie o servidor**

```bash
npm start
```

> A aplicação estará disponível em `http://localhost:3000`.

---

### Rodar apenas o jogo (sem o servidor)

Caso queira testar somente o jogo da Parte 1:

```bash
cd game
npx live-server
```

**Modo debug** — ativa botão de teste e atalhos de teclado:

```
http://127.0.0.1:8080/?debug
```

| Tecla | Ação |
|---|---|
| `A` | Spawna um vegetal aleatório em posição aleatória |
| `D` | Despawna todos os vegetais da tela |
| `J` | Lança um obstáculo único |
| `K` | Lança uma sequência de 3 vegetais |
| `L` | Lança dois vegetais espelhados |

---

## 🏗️ Arquitetura do Projeto

```
vegetable-samurai/
├── .env.example                # Variáveis de ambiente (template versionável)
├── .gitignore
├── package.json
├── prisma/
│   └── schema.prisma           # Modelos Major, User e GameSession
├── game/                       # Jogo da Parte 1 (JavaScript puro)
│   ├── index.html
│   ├── css/
│   ├── assets/
│   └── js/
│       ├── main.js             # Ponto de entrada do jogo
│       ├── config.js           # Estado global (pontuação, vidas)
│       ├── entidadeBase.js     # Classe base abstrata
│       ├── vegetal.js          # Vegetais cortáveis
│       ├── bomba.js            # Obstáculo letal
│       ├── madeira.js          # Obstáculo que zera combo
│       ├── entidades.js        # Pool de entidades
│       ├── spawner.js          # Controlador de spawn
│       ├── diretor.js          # Diretor de dificuldade progressiva
│       ├── lamina.js           # Lâmina do mouse
│       ├── colisao.js          # Detecção de colisão
│       ├── game.js             # Motor do jogo
│       ├── score.js            # Sistema de pontuação e HUD
│       ├── particulas.js       # Efeitos visuais
│       └── sfx.js              # Efeitos sonoros
└── src/                        # Aplicação Express (Parte 2)
    ├── controllers/
    │   ├── main.ts             # Controlador principal (hb1-hb4, lorem, about)
    │   ├── MajorController.ts  # CRUD de cursos
    │   ├── UserController.ts   # Cadastro e login
    │   └── GameSessionController.ts  # Jogo e salvamento de scores
    ├── services/
    │   ├── MajorService.ts     # Lógica de negócio dos cursos
    │   ├── UserService.ts      # Lógica de negócio dos usuários
    │   └── GameSessionService.ts     # Salvamento e ranking de scores
    ├── middlewares/
    │   ├── authMiddleware.ts   # Proteção de rotas autenticadas
    │   └── logger.ts           # Log de requisições em arquivo
    ├── router/
    │   └── router.ts           # Todas as rotas da aplicação
    ├── types/
    │   └── MajorTypes.ts       # Interfaces e DTOs
    ├── utils/
    │   └── validateEnv.ts      # Validação de variáveis de ambiente
    └── views/                  # Templates Handlebars
        ├── layouts/
        ├── about/
        ├── game/
        ├── major/
        ├── user/
        └── main/
```

---

## 👥 Divisão de Responsabilidades

A divisão detalhada por issue está na aba **Issues** do repositório:

🔗 [github.com/juliaChaparro/vegetable-samurai/issues](https://github.com/juliaChaparro/vegetable-samurai/issues)

### Victor Hugo — Motor do Jogo e Infraestrutura Web
**Parte 1:** Motor do jogo (`game.js`), game loop, telas de menu e game over, Diretor de Dificuldade, integração dos módulos.
**Parte 2:** Setup do projeto Express + TypeScript, arquitetura MVC, layout Handlebars, configuração do SASS, Navbar dinâmica com Bootstrap, CRUD de cursos (rotas e views).

### Julia Chaparro — Lâmina, Colisão e Autenticação
**Parte 1:** Sistema de rastro do mouse (`lamina.js`), detecção de colisão por interpolação linear, design e assets visuais dos vegetais e telas.
**Parte 2:** Validação de variáveis de ambiente (`validateEnv.ts`), middleware de logs, página About, CRUD de Major, integração do jogo na rota `/` com bloqueio para usuários não autenticados e salvamento de scores via Ajax.

### Pedro Barreto — Entidades, Física e Banco de Dados
**Parte 1:** Classe base `EntidadeBase`, classes `Vegetal`, `Bomba` e `Madeira`, pool de entidades, sistema de spawn.
**Parte 2:** Configuração do Prisma ORM, modelos `Major`, `User` e `GameSession`, migrations, modal de exclusão via Ajax, página de Ranking.

### Carlos Henrique — Pontuação, Efeitos e Cadastro de Usuários
**Parte 1:** Sistema de pontuação e HUD (`score.js`), efeitos visuais de split e splash (`particulas.js`), gerenciador de SFX (`sfx.js`), sistema de combos e best score.
**Parte 2:** Página de cadastro de usuários com criptografia de senha, views de teste do Handlebars (hb1–hb4), helper customizado, rota `/lorem`.

---

## 🛠️ Tecnologias Utilizadas

**Parte 1:**
- **HTML5** e **CSS3** — estrutura, animações, clip-path, variáveis CSS
- **JavaScript ES2022** — ES Modules, Classes, CustomEvents, localStorage, Web Audio API

**Parte 2:**
- **Node.js** e **Express 5** — servidor web
- **TypeScript** — tipagem estática
- **Prisma ORM** — acesso ao banco de dados
- **MySQL** — banco de dados relacional
- **Handlebars** — engine de templates
- **Bootstrap 5** — estilização e componentes UI
- **SASS** — pré-processador CSS
- **express-session** — gerenciamento de sessões
- **envalid** — validação de variáveis de ambiente
- **bcrypt** — criptografia de senhas

---

## 📝 Observações

- O arquivo `.env` **não deve ser versionado** — use o `.env.example` como base.
- Os diretórios `node_modules` e `build` também não são versionados.
- O jogo usa **ES Modules** (`type="module"`), portanto não abre diretamente no navegador sem um servidor local.
- Efeitos sonoros (`corte.mp3`, `bomba.mp3`, `combo.mp3`, `trilha.mp3`) ficam em `game/assets/sfx/`. O jogo funciona sem eles, apenas sem som.
- Testado nos navegadores Google Chrome e Microsoft Edge.
