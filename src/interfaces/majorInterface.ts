export interface IMajor {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Data Transfer Object (DTO) para criação
export interface ICreateMajorDTO {
  name: string;
  description?: string;
}

// DTO para atualização (campos opcionais)
export interface IUpdateMajorDTO {
  name?: string;
  description?: string;
}