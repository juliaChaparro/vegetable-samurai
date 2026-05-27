// Importa o Juiz para podermos fatiar a fruta falsa
import { Juiz } from './score.js';

export function iniciarDebug() {
    console.log("🛠️ Modo Debug Ativado!");

    // 1. Cria o botão na tela
    const btnDebug = document.createElement('button');
    btnDebug.innerText = "Testar Corte";
    btnDebug.style.cssText = `
        position: absolute; 
        bottom: 20px; 
        right: 20px; 
        z-index: 9999;
        padding: 12px 20px; 
        background: #e74c3c; 
        color: #fff;
        border: 2px solid white; 
        border-radius: 8px; 
        cursor: pointer; 
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    document.getElementById('game').appendChild(btnDebug);

    // 2. Lógica do clique (cria a fruta e manda o Juiz cortar)
    btnDebug.addEventListener('click', () => {
        const frutaFalsa = document.createElement('div');
        frutaFalsa.className = 'entidade fruta';
        frutaFalsa.dataset.tipo = 'tomate';
        frutaFalsa.style.cssText = 'position: absolute; width: 60px; height: 60px; background: red; border-radius: 50%; top: 50%; left: 45%; border: 2px solid darkred; box-shadow: inset -10px -10px 10px rgba(0,0,0,0.3);';

        document.getElementById('game').appendChild(frutaFalsa);

        setTimeout(() => {
            Juiz.cortarAlvo(frutaFalsa);
        }, 300); 
    });
}