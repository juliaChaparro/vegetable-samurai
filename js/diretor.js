// =============================================================
// diretor.js — DiretorDeJogo
// Responsável: Progressão de Dificuldade
//
// O DiretorDeJogo é o maestro da partida: ele observa o
// tempoDePartida e decide, a cada update(), qual padrão de
// lançamento acionar no ControladorDeSpawn.
//
// Dependências:
//   ControladorDeSpawn  (spawner.js)   — executa os lançamentos
//   ESTADO_DO_JOGO      (config.js)    — lê pontuação e vidas
//
// Como integrar em game.js:
//   import { DiretorDeJogo } from './diretor.js';
//   // dentro de mudarTela('jogando'):
//   this.diretor = new DiretorDeJogo(this.spawner);
//   // dentro do frameDoJogo, após update das entidades:
//   if (this.diretor) this.diretor.update(deltaTime);
// =============================================================

import { ControladorDeSpawn } from './spawner.js';
import { ESTADO_DO_JOGO } from './config.js';
import { Utils } from './utils.js';

export class DiretorDeJogo {

    /**
     * @param {ControladorDeSpawn} spawner  Instância do controlador de spawn
     *                                       já criado pelo MotorDoJogo.
     */
    constructor(spawner) {
        this.spawner = spawner;

        // ── Tempo acumulado de partida (segundos) ──────────────
        this.tempoDePartida = 0;

        // ── Cooldown entre lançamentos ─────────────────────────
        // Começa alto e vai reduzindo conforme o jogo avança.
        this.cooldownAtual   = 0;      // contador regressivo (s)
        this.cooldownBase    = 2.5;    // segundos entre cada decisão

        // ── Variáveis de estado interno ────────────────────────
        this.tamanhoDoCombo  = 1;      // quantas frutas numa sequência
        this.chanceDePerigo  = 0.10;   // probabilidade base de spawnar obstáculo

        // ── Fase atual (0 = fácil … 4 = inferno) ──────────────
        this.fase = 0;

        // ── Limites de cada fase (em segundos) ─────────────────
        // Fases: 0-CALMA | 1-AQUECIMENTO | 2-PRESSÃO | 3-FRENESI | 4-INFERNO
        this._limitesFase = [0, 20, 45, 75, 110];

        console.log('[Diretor] Inicializado. Partida começa na Fase 0 — Calma.');
    }

    // ── Loop principal ─────────────────────────────────────────

    /**
     * @brief Deve ser chamado a cada frame pelo MotorDoJogo, após
     *        o update das entidades.
     * @param {number} deltaTime  Tempo do frame em segundos
     */
    update(deltaTime) {
        this.tempoDePartida += deltaTime;
        this._atualizarFase();

        this.cooldownAtual -= deltaTime;
        if (this.cooldownAtual <= 0) {
            this._executarDecisao();
            this.cooldownAtual = this._calcularProximoCooldown();
        }
    }

    // ── Lógica de fase ─────────────────────────────────────────

    /**
     * @brief Avança a fase quando o tempo de partida ultrapassa
     *        o limiar configurado em _limitesFase.
     * @private
     */
    _atualizarFase() {
        for (let i = this._limitesFase.length - 1; i >= 0; i--) {
            if (this.tempoDePartida >= this._limitesFase[i] && this.fase < i) {
                this.fase = i;
                this._aplicarParametrosDeFase();
                break;
            }
        }
    }

    /**
     * @brief Ajusta cooldownBase, tamanhoDoCombo e chanceDePerigo
     *        de acordo com a fase atual.
     * @private
     */
    _aplicarParametrosDeFase() {
        const config = {
            // fase: { cooldown, combo, perigo }
            0: { cooldown: 2.5, combo: 1, perigo: 0.05 },  // Calma
            1: { cooldown: 2.0, combo: 2, perigo: 0.10 },  // Aquecimento
            2: { cooldown: 1.5, combo: 3, perigo: 0.18 },  // Pressão
            3: { cooldown: 1.1, combo: 3, perigo: 0.25 },  // Frenesi
            4: { cooldown: 0.8, combo: 4, perigo: 0.35 },  // Inferno
        }[this.fase];

        this.cooldownBase    = config.cooldown;
        this.tamanhoDoCombo  = config.combo;
        this.chanceDePerigo  = config.perigo;

        const nomes = ['Calma', 'Aquecimento', 'Pressão', 'Frenesi', 'Inferno'];
        console.log(
            `[Diretor] ⚡ FASE ${this.fase} — ${nomes[this.fase]} ` +
            `| cooldown=${config.cooldown}s | combo=${config.combo} | perigo=${(config.perigo * 100).toFixed(0)}%`
        );
    }

    /**
     * @brief Adiciona variação aleatória ao cooldown para que os
     *        lançamentos não pareçam mecânicos.
     * @private
     * @returns {number}  Próximo cooldown em segundos
     */
    _calcularProximoCooldown() {
        const variacao = Utils.randomFloatExclusivo(
            this.cooldownBase * 0.8,
            this.cooldownBase * 1.3
        );
        return variacao;
    }

    // ── Decisão de lançamento ──────────────────────────────────

    /**
     * @brief Decide qual padrão de lançamento usar com base na
     *        fase e no estado atual do jogo, usando if/else if
     *        como descrito no documento de design.
     * @private
     */
    _executarDecisao() {
        const t = this.tempoDePartida;

        // ── Fase 0: Calma ──────────────────────────────────────
        // Apenas frutas únicas. Obstáculos raramente aparecem.
        if (this.fase === 0) {
            if (this._sorteioDePerigo()) {
                this.spawner.lancarEntidadeUnica('obstaculo');
            } else {
                this.spawner.lancarEntidadeUnica('vegetal');
            }
        }

        // ── Fase 1: Aquecimento ────────────────────────────────
        // Introduz espelhadas e sequências de 2 frutas.
        else if (this.fase === 1) {
            if (this._sorteioDePerigo()) {
                this.spawner.lancarEntidadeUnica('obstaculo');
            } else {
                const padrao = Utils.randomIntExclusivo(0, 3); // 1 ou 2
                if (padrao === 1) {
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                } else {
                    this.spawner.lancarEntidadeSequencia(2, 'vegetal');
                }
            }
        }

        // ── Fase 2: Pressão ────────────────────────────────────
        // Mistura padrões, obstáculos embutidos nas sequências.
        else if (this.fase === 2) {
            if (this._sorteioDePerigo()) {
                // Obstáculo "escondido" junto de uma fruta
                this.spawner.lancarEntidadeUnica('obstaculo');
                this.spawner.lancarEntidadeUnica('vegetal');
            } else {
                const padrao = Utils.randomIntExclusivo(0, 4); // 1, 2 ou 3
                if (padrao === 1) {
                    this.spawner.lancarEntidadeSequencia(this.tamanhoDoCombo, 'vegetal');
                } else if (padrao === 2) {
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                } else {
                    this.spawner.lancarEntidadeUnica('vegetal');
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                }
            }
        }

        // ── Fase 3: Frenesi ────────────────────────────────────
        // Sequências longas, espelhadas duplas, bombas mais frequentes.
        else if (this.fase === 3) {
            if (this._sorteioDePerigo()) {
                // Bomba espelhada com fruta: teste de atenção do jogador
                this.spawner.lancarEntidadeEspelhada('obstaculo');
            } else {
                const padrao = Utils.randomIntExclusivo(0, 4); // 1, 2 ou 3
                if (padrao === 1) {
                    this.spawner.lancarEntidadeSequencia(this.tamanhoDoCombo, 'vegetal');
                } else if (padrao === 2) {
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                    this.spawner.lancarEntidadeUnica('vegetal');
                } else {
                    // Tudo de uma vez
                    this.spawner.lancarEntidadeSequencia(2, 'vegetal');
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                }
            }
        }

        // ── Fase 4: Inferno ────────────────────────────────────
        // Máxima densidade. Obstáculos surgem com e sem frutas.
        else if (this.fase === 4) {
            if (this._sorteioDePerigo()) {
                // Obstáculo + sequência simultâneos: obriga priorizar
                this.spawner.lancarEntidadeUnica('obstaculo');
                this.spawner.lancarEntidadeSequencia(2, 'vegetal');
            } else {
                const padrao = Utils.randomIntExclusivo(0, 4); // 1, 2 ou 3
                if (padrao === 1) {
                    this.spawner.lancarEntidadeSequencia(this.tamanhoDoCombo, 'vegetal');
                    this.spawner.lancarEntidadeUnica('vegetal');
                } else if (padrao === 2) {
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                } else {
                    this.spawner.lancarEntidadeSequencia(this.tamanhoDoCombo, 'vegetal');
                    this.spawner.lancarEntidadeEspelhada('vegetal');
                }
            }
        }
    }

    // ── Helpers ────────────────────────────────────────────────

    /**
     * @brief Retorna true com probabilidade igual a chanceDePerigo.
     * Penaliza jogadores com poucas vidas (bomba fica mais rara
     * para não empilhar mortes, mas madeira aparece mais).
     * @private
     * @returns {boolean}
     */
    _sorteioDePerigo() {
        // Com 1 vida restante reduz levemente a chance de bomba instantânea
        const fatorVida = ESTADO_DO_JOGO.vidas <= 1 ? 0.6 : 1.0;
        return Math.random() < (this.chanceDePerigo * fatorVida);
    }

    // ── Debug ──────────────────────────────────────────────────

    /**
     * @brief Retorna um snapshot do estado atual do Diretor.
     *        Útil para debug.js ou overlays de desenvolvimento.
     * @returns {Object}
     */
    estado() {
        return {
            tempoDePartida:  this.tempoDePartida.toFixed(1),
            fase:            this.fase,
            cooldownAtual:   this.cooldownAtual.toFixed(2),
            tamanhoDoCombo:  this.tamanhoDoCombo,
            chanceDePerigo:  (this.chanceDePerigo * 100).toFixed(0) + '%',
        };
    }
}