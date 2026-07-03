// =============================================================
// UserController.ts — Página de cadastro de usuários
// =============================================================
import type { Request, Response } from "express";
import MajorService from "../services/MajorService.js";
import UserService from "../services/UserService.js";
import type { IRegisterFormData } from "../interfaces/majorInterface.js";

const renderRegister = async (
  res: Response,
  options: {
    error?: string;
    form?: Partial<IRegisterFormData>;
  } = {},
) => {
  const majors = await MajorService.findAll();
  res.render("user/register", {
    error: options.error,
    fullname: options.form?.fullname ?? "",
    email: options.form?.email ?? "",
    majorId: options.form?.majorId ?? "",
    majors,
  });
};

const create = async (req: Request, res: Response) => {
  try {
    const majors = await MajorService.findAll();
    res.render("user/register", {
      success: req.query.success === "1",
      fullname: "",
      email: "",
      majorId: "",
      majors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar página de cadastro.");
  }
};

const store = async (req: Request, res: Response) => {
  const { fullname, email, password, repeatPassword, majorId } = req.body as IRegisterFormData;
  const form = { fullname, email, password, repeatPassword, majorId };

  try {
    if (!fullname?.trim() || !email?.trim() || !password || !repeatPassword || !majorId) {
      await renderRegister(res, {
        error: "Todos os campos são obrigatórios.",
        form,
      });
      return;
    }

    if (password !== repeatPassword) {
      await renderRegister(res, {
        error: "As senhas não coincidem.",
        form,
      });
      return;
    }

    if (await UserService.emailAlreadyExists(email.trim())) {
      await renderRegister(res, {
        error: "Este e-mail já está cadastrado.",
        form,
      });
      return;
    }

    const major = await MajorService.findById(majorId);
    if (!major) {
      await renderRegister(res, {
        error: "Curso selecionado inválido.",
        form,
      });
      return;
    }

    await UserService.create({
      fullname: fullname.trim(),
      email: email.trim(),
      password,
      majorId,
    });

    res.redirect("/user/register?success=1");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar usuário.");
  }
};

export default { create, store };
