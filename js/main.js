import { MotorDoJogo } from "./game.js";
import { Lamina } from "./lamina.js"; 
import { Juiz } from "./score.js"; 

Juiz.init();
const motor = new MotorDoJogo();
motor.inicializar();
const lamina = new Lamina(motor);

// Sistema de Debug Isolado (Carrega só se tiver ?debug=true na URL)
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('debug')) {
    import('./debug.js')
        .then((moduloDebug) => {
            moduloDebug.iniciarDebug(); 
        })
        .catch(err => console.error("Erro ao carregar módulo de debug:", err));
}