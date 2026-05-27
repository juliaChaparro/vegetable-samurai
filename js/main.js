import { MotorDoJogo } from "./game.js";
import { Vegetable } from "./vegetable.js";
import { Lamina } from "./lamina.js";
import { Juiz } from "./score.js"; 

Juiz.init();
new Lamina();


const motor = new MotorDoJogo();
motor.inicializar();

// Sistema de Debug Isolado (Carrega só se tiver ?debug=true na URL)
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('debug')) {
    import('./debug.js')
        .then((moduloDebug) => {
            moduloDebug.iniciarDebug(); // Roda a função que cria o botão
        })
        .catch(err => console.error("Erro ao carregar módulo de debug:", err));
}