// js/utils.js

export const Utils = {
    /**
     * Retorna um número DECIMAL (float) aleatório estritamente entre min e max.
     * Útil para física, forças, ângulos e tempos quebrados.
     * Exemplo: (5, 10) pode retornar 5.00001 ou 9.9999, mas nunca 5 ou 10.
     * * @param {number} min Valor mínimo (exclusivo)
     * @param {number} max Valor máximo (exclusivo)
     * @returns {number}
     */
    randomFloatExclusivo(min, max) {
        let resultado = min;
        
        // A função Math.random() nativa gera de [0, 1). 
        // Como o 0 é inclusivo, existe a chance (rara) de retornar exatamente o 'min'.
        // O loop garante que o número seja re-sorteado caso caia perfeitamente na borda.
        while (resultado === min) {
            resultado = Math.random() * (max - min) + min;
        }
        
        return resultado;
    },

    /**
     * Retorna um número INTEIRO aleatório estritamente entre min e max.
     * Útil para sortear índices de arrays, tipos de inimigos ou quantidades exatas.
     * Exemplo: (5, 10) só pode retornar 6, 7, 8 ou 9.
     * * @param {number} min Valor mínimo (exclusivo)
     * @param {number} max Valor máximo (exclusivo)
     * @returns {number}
     */
    randomIntExclusivo(min, max) {
        // Arredonda as pontas para "fechar" o intervalo com segurança para dentro
        const minInt = Math.floor(min) + 1;
        const maxInt = Math.ceil(max) - 1;

        // Trava de segurança caso o intervalo não tenha números inteiros no meio (ex: 5.1 e 5.5)
        if (minInt > maxInt) {
            console.warn(`[Utils] Intervalo sem inteiros entre ${min} e ${max}!`);
            return minInt; 
        }

        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    },

    /**
     * Sorteia um item aleatório de dentro de um Array.
     * Excelente para o Spawner sortear se vai nascer 'tomate', 'repolho' ou 'bomba'.
     * * @param {Array} array Lista de itens
     * @returns {*} Um elemento aleatório da lista
     */
    randomElemento(array) {
        if (!array || array.length === 0) return null;
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }
};