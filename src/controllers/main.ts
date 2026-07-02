import { type Request, type Response } from "express"
import { type Prof, type Technology } from "../views/helpers/helpers.js";
import { loremIpsum } from "lorem-ipsum";

const index = (req: Request, res: Response) => {
  res.json({
    teste: "teste",
  });
}

const about = (req: Request, res: Response) => {
  res.render("main/about", {
    title: "Sobre - Vegetable Samurai"
  });
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
  const technologies: Technology[] = [
    { name: 'Express', type: 'Framework', poweredByNodejs: true },
    { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
    { name: 'React', type: 'Library', poweredByNodejs: true },
    { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
    { name: 'Django', type: 'Framework', poweredByNodejs: false },
    { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
    { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
  ];
  res.render("main/hb4", {
    technologies,
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