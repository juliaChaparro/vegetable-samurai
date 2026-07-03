// =============================================================
// GameSessionController.ts — Controlador do jogo e scores
// Responsável: Membro 2 | Exercício #16
// =============================================================
import type { Request, Response } from "express";
import GameSessionService from "../services/GameSessionService.js";

// ── Rota GET / — serve o jogo (só logados chegam aqui) ────────
const index = (req: Request, res: Response) => {
    res.render("game/index");
};

// ── Rota POST /score — recebe Ajax do Game Over ────────────────
const salvarScore = async (req: Request, res: Response) => {
    try {
        const userId = req.session.uid;

        if (!userId) {
            res.status(401).json({ success: false, message: "Não autenticado." });
            return;
        }

        const score = Number(req.body.score);

        if (isNaN(score) || score < 0) {
            res.status(400).json({ success: false, message: "Score inválido." });
            return;
        }

        await GameSessionService.salvarScore(userId, score);
        res.json({ success: true });

    } catch (error) {
        console.error("[GameSession] Erro ao salvar score:", error);
        res.status(500).json({ success: false, message: "Erro interno." });
    }
};

// ── Rota GET /ranking — exibe o Top 10 (#17) ───────────────────
const ranking = async (req: Request, res: Response) => {
    try {
        const topScores = await GameSessionService.topScores();
        res.render("game/ranking", { topScores });
    } catch (error) {
        console.error("[GameSession] Erro ao buscar ranking:", error);
        res.status(500).send("Erro interno ao carregar o ranking.");
    }
};

export default { index, salvarScore, ranking };
