import { type Request, type Response } from "express"
import { type Prof } from "../views/helpers/helpers.js";

const index = (req: Request, res: Response) => {
  res.json({
    teste: "teste",
  });
}

const about = (req: Request, res: Response) => {
  res.send("Página about");
}

const bemvindo = (req: Request, res: Response) => {
  const { nome, sobrenome } = req.params;
  res.send(`Seja bem-vindo(a), ${nome} ${sobrenome}!`);
}

const hb1 = (req: Request, res: Response) => {
  const message = "Olá, você está aprendendo Express + HBS";
  res.render("main/hb1", {
    message,
  });
}

const hb2  = (req: Request, res: Response) => {
  const message = "Express Framework";
  res.render("main/hb2", {
    message,
    mostrarMsg: true,
  });
}

const hb3 = (req: Request, res: Response) => {
  const message = "Algumas plantas do amazonas:";
  const plantas = ["Vitória-régia", "Seringueira", "Guaraná"];
  res.render("main/hb3", {
    message,
    plantas,
  });
}

const hb4 = (req: Request, res: Response) => {
  const profs: Prof[] = [
    { nome: "Edleno Moura", sala: 1236 },
    { nome: "Eduardo Feitosa", sala: 1234 },
    { nome: "Elaine Harada", sala: 1274 },
  ];
  res.render("main/hb4", {
    profs,
  });
}

export default {
    index,
    about,
    bemvindo,
    hb1,
    hb2,
    hb3,
    hb4
}