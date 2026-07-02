import { Router } from "express";
import mainController from "../controllers/main.js"

const router = Router();

router.get("/", mainController.index);

router.get("/about", (req, res) => {
    res.render("about", { 
        title: "Sobre - Vegetable Samurai" 
    });
});

// router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemvindo);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);
router.get("/lorem/:quantidade", mainController.lorem);

// Definição das rotas CRUD de Majors
router.post("/majors", majorController.create);
router.get("/majors", majorController.getAll);
router.get("/majors/:id", majorController.getById);
router.put("/majors/:id", majorController.update);
router.delete("/majors/:id", majorController.delete);


export default router;
