import { PrismaClient } from "@prisma/client";
import { type IMajor, type ICreateMajorDTO, type IUpdateMajorDTO } from "../interfaces/majorInterface.js";

const prisma = new PrismaClient();

export class MajorService {
  // Create
  async create(data: ICreateMajorDTO): Promise<IMajor> {
    return await prisma.major.create({
      data,
    });
  }

  // Read (Todos)
  async findAll(): Promise<IMajor[]> {
    return await prisma.major.findMany();
  }

  // Read (Por ID)
  async findById(id: number): Promise<IMajor | null> {
    return await prisma.major.findUnique({
      where: { id },
    });
  }

  // Update
  async update(id: number, data: IUpdateMajorDTO): Promise<IMajor> {
    return await prisma.major.update({
      where: { id },
      data,
    });
  }

  // Delete
  async delete(id: number): Promise<IMajor> {
    return await prisma.major.delete({
      where: { id },
    });
  }
}