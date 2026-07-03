import { Router } from "express";
import mainController from "../controllers/main.js";
import MajorController from "../controllers/MajorController.js";
import GameSessionController from "../controllers/GameSessionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// ── Rotas públicas ─────────────────────────────────────────────
router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemvindo);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);
router.get("/lorem/:quantidade", mainController.lorem);

// ── Jogo — apenas usuários logados (#16) ──────────────────────
router.get("/", authMiddleware, GameSessionController.index);

// ── Salvar score via Ajax (#16) ────────────────────────────────
router.post("/score", authMiddleware, GameSessionController.salvarScore);

// ── Major CRUD (#13 e #14) ─────────────────────────────────────
router.get("/major", MajorController.index);
router.get("/major/create", MajorController.create);
router.post("/major", MajorController.store);
router.get("/major/:id/edit", MajorController.edit);
router.post("/major/:id/update", MajorController.update);
router.post("/major/:id/delete", MajorController.destroy);

export default router;
