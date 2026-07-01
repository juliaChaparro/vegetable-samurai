import { Router } from "express";
import { LoremIpsum } from "lorem-ipsum";

const router = Router();

const lorem = new LoremIpsum();

router.get("/lorem/:numero", (req, res) => {

    const numero = Number(req.params.numero);

    if (isNaN(numero) || numero < 1) {
        return res.status(400).send("Número inválido");
    }

    let html = "";

    for (let i = 0; i < numero; i++) {
        html += `<p>${lorem.generateParagraphs(1)}</p>`;
    }

    res.send(html);

});

export default router;