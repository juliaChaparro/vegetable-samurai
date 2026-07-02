// =============================================================
// MajorService.ts — Serviço do CRUD de Major
// Responsável: Membro 2 | Exercício #13
// =============================================================
import { PrismaClient } from "../generated/prisma/index.js";
import type { CreateMajorDTO, UpdateMajorDTO } from "../types/MajorTypes.js";

const prisma = new PrismaClient();

const MajorService = {

    /**
     * Retorna todos os cursos cadastrados.
     */
    async findAll() {
        return prisma.major.findMany({
            orderBy: { name: "asc" },
        });
    },

    /**
     * Retorna um curso pelo ID.
     */
    async findById(id: string) {
        return prisma.major.findUnique({
            where: { id },
        });
    },

    /**
     * Cria um novo curso.
     */
    async create(data: CreateMajorDTO) {
        return prisma.major.create({ data });
    },

    /**
     * Atualiza um curso existente.
     */
    async update(id: string, data: UpdateMajorDTO) {
        return prisma.major.update({
            where: { id },
            data,
        });
    },

    /**
     * Remove um curso pelo ID.
     */
    async delete(id: string) {
        return prisma.major.delete({
            where: { id },
        });
    },
};

export default MajorService;
