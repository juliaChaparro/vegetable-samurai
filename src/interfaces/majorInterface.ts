export interface IMajor {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Data Transfer Object (DTO) para criação
export interface ICreateMajorDTO {
  name: string;
  code: string;
  description: string;
}

// DTO para atualização (campos opcionais)
export interface IUpdateMajorDTO {
  name?: string;
  code?: string;
  description?: string;
}