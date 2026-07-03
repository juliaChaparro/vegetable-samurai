import type { Request, Response } from "express";
import { checkAuth, getUserByEmail } from "../services/auth.js";

const loginForm = (req: Request, res: Response) => {
  res.render("main/login", { error: req.query.error === "1" });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const isAuth = await checkAuth({ email, password });
    
    if (!isAuth) {
      res.redirect("/login?error=1");
      return;
    }
    
    const user = await getUserByEmail(email);
    if (user) {
      req.session.uid = user.id;
      res.redirect("/");
    } else {
      res.redirect("/login?error=1");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar login.");
  }
};

const logout = (req: Request, res: Response) => {
  req.session.destroy(function (err) {
    if (err) res.send(err);
    else res.redirect("/");
  });
};

export default { loginForm, login, logout };
