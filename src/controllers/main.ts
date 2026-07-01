import { type Request, type Response } from "express"
import { type Prof } from "../views/helpers/helpers.js";
import { loremIpsum } from "lorem-ipsum";

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
  const message = "Seja bem-vindo(a) ao IComp";
  res.render("main/hb1", {
    message,
  });
}

const hb2  = (req: Request, res: Response) => {
  const message = "Seja bem-vindo(a) ao IComp";
  res.render("main/hb2", {
    message,
    ehBemVindo: true,
  });
}

const hb3 = (req: Request, res: Response) => {
  const profs: Prof[] = [
    { nome: "Edleno Moura", sala: 1236 },
    { nome: "Eduardo Feitosa", sala: 1234 },
    { nome: "Elaine Harada", sala: 1274 },
  ];
  res.render("main/hb3", {
    profs,
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
const lorem = (req: Request, res: Response) => {
  const quantidadeParam = typeof req.params.quantidade === "string" ? req.params.quantidade : "";
  const quantidade = parseInt(quantidadeParam, 10);
  if (isNaN(quantidade) || quantidade <= 0) {
    res.status(400).send("Parâmetro inválido. Por favor, forneça um número inteiro positivo.");
    return;
  }

  const generatedText = loremIpsum({
    count: quantidade,
    units: "paragraphs",
    format: "plain",
  });

  // Dividimos o texto por quebras de linha para obter o array de parágrafos
  const paragraphs = generatedText.split(/\r?\n/).filter(p => p.trim() !== "");

  const textParagrafos = quantidade === 1 ? "parágrafo" : "parágrafos";
  const title = `Gerador de Lorem Ipsum (${quantidade} ${textParagrafos})`;

  res.render("main/lorem", {
    title,
    paragraphs,
  });
}

export default {
    index,
    about,
    bemvindo,
    hb1,
    hb2,
    hb3,
    hb4,
    lorem
}