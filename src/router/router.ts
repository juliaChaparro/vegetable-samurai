import { Router } from "express";
import mainController from "../controllers/main.js"
import majorController from "../controllers/major.js";
import authController from "../controllers/auth.js";
import gameController from "../controllers/game.js";

const router = Router();

router.get("/", mainController.index);
router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemvindo);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);
router.get("/lorem/:quantidade", mainController.lorem);

router.get("/cookie", majorController.testCookie);

router.all("/signup", authController.signup);
router.all("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/major", majorController.index);
router.all("/major/create", majorController.create);
router.get("/major/read/:id", majorController.read);
router.all("/major/update/:id", majorController.update);
router.post("/major/remove/:id", majorController.remove);

router.get("/play", gameController.play);

export default router;
