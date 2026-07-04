// =============================================================
// UserService.ts — Cadastro de usuários com bcryptjs
// =============================================================
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { ICreateUserDTO } from "../interfaces/majorInterface.js";

const prisma = new PrismaClient();

const UserService = {
  async emailAlreadyExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user !== null;
  },

  async create(user: ICreateUserDTO) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    return prisma.user.create({
      data: {
        fullname: user.fullname,
        email: user.email,
        password,
        majorId: user.majorId,
      },
    });
  },
};

export default UserService;
