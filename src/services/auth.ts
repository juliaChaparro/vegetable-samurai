import type { LoginDto } from '../types/user.js';
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkAuth = async (credentials: LoginDto): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });
  
  if (!user) return false;
  
  return await bcrypt.compare(
    credentials.password, user.password
  );
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
