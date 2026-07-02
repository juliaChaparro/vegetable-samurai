// =============================================================
// MajorController.ts — Controlador do CRUD de Major
// Responsável: Membro 2 | Exercício #13
// =============================================================
import type { Request, Response } from "express";
import MajorService from "../services/MajorService.js";

// ── Listar todos ───────────────────────────────────────────────
const index = async (req: Request, res: Response) => {
    try {
        const majors = await MajorService.findAll();
        res.render("major/index", { majors });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar cursos.");
    }
};

// ── Formulário de criação ──────────────────────────────────────
const create = (req: Request, res: Response) => {
    res.render("major/create");
};

// ── Salvar novo curso ──────────────────────────────────────────
const store = async (req: Request, res: Response) => {
    try {
        const { name, code, description } = req.body as {
            name: string;
            code: string;
            description: string;
        };

        if (!name || !code || !description) {
            res.status(400).render("major/create", {
                error: "Todos os campos são obrigatórios.",
                name, code, description,
            });
            return;
        }

        await MajorService.create({ name, code, description });
        res.redirect("/major");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar curso.");
    }
};

// ── Formulário de edição ───────────────────────────────────────
const edit = async (req: Request, res: Response) => {
    try {
        const major = await MajorService.findById(req.params.id ?? "");
        if (!major) {
            res.status(404).send("Curso não encontrado.");
            return;
        }
        res.render("major/edit", { major });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar curso.");
    }
};

// ── Salvar edição ──────────────────────────────────────────────
const update = async (req: Request, res: Response) => {
    try {
        const { name, code, description } = req.body as {
            name: string;
            code: string;
            description: string;
        };

        await MajorService.update(req.params.id ?? "", { name, code, description });
        res.redirect("/major");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao atualizar curso.");
    }
};

// ── Deletar (chamado via Ajax) ─────────────────────────────────
const destroy = async (req: Request, res: Response) => {
    try {
        await MajorService.delete(req.params.id ?? "");
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao deletar curso." });
    }
};

export default { index, create, store, edit, update, destroy };
