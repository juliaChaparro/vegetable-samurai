import { Router } from "express";
import mainController from "../controllers/main.js";
import MajorController from "../controllers/MajorController.js";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.get("/", mainController.index);
router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemvindo);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);
router.get("/lorem/:quantidade", mainController.lorem);

// ── Major CRUD — Membro 2 (#13 e #14) ─────────────────────────
router.get("/major", MajorController.index);
router.get("/major/create", MajorController.create);
router.post("/major", MajorController.store);
router.get("/major/:id/edit", MajorController.edit);
router.post("/major/:id/update", MajorController.update);
router.post("/major/remove/:id", MajorController.destroy);

// ── Cadastro de usuários ───────────────────────
router.get("/user/register", UserController.create);
router.post("/user/register", UserController.store);

// ── Autenticação ─────────────────────────
router.get("/login", AuthController.loginForm);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

export default router;
