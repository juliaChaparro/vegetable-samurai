// =============================================================
// GameSessionService.ts — Serviço de sessões de jogo
// Responsável: Membro 2 | Exercício #16
// =============================================================
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GameSessionService = {

    /**
     * Salva a pontuação de uma partida no banco.
     * @param userId  ID do usuário logado (vem de req.session.uid)
     * @param score   Pontuação final da partida
     */
    async salvarScore(userId: string, score: number) {
        return prisma.gameSession.create({
            data: { userId, score },
        });
    },

    /**
     * Retorna as 10 melhores pontuações distintas por usuário.
     * Útil para o Ranking (#17 — Membro 3).
     */
    async topScores() {
        return prisma.gameSession.findMany({
            orderBy: { score: "desc" },
            distinct: ["userId"],
            take: 10,
            include: {
                user: {
                    select: { fullname: true },
                },
            },
        });
    },
};

export default GameSessionService;
