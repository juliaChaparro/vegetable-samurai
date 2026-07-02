import { Request, Response } from "express";
import { MajorService } from "../services/majorService.js";

const majorService = new MajorService();

export class MajorController {
  // POST /majors
  async create(req: Request, res: Response): Promise<void> {
    try {
      const newMajor = await majorService.create(req.body);
      res.status(201).json(newMajor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /majors
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const majors = await majorService.findAll();
      res.status(200).json(majors);
    } catch (error: any) {
      res.status(500).json({ error: "Erro interno ao buscar majors." });
    }
  }

  // GET /majors/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const major = await majorService.findById(id);
      
      if (!major) {
        res.status(404).json({ error: "Major não encontrado." });
        return;
      }
      
      res.status(200).json(major);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /majors/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedMajor = await majorService.update(id, req.body);
      res.status(200).json(updatedMajor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /majors/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await majorService.delete(id);
      res.status(204).send(); // Sucesso sem conteúdo de retorno
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}