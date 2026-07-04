// =============================================================
// authMiddleware.ts — Proteção de rotas autenticadas
// Responsável: Membro 2 | Exercício #16
// =============================================================
import type { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.uid) {
        res.redirect("/login");
        return;
    }
    next();
};

export default authMiddleware;
