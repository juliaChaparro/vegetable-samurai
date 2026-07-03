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

export interface ICreateUserDTO {
  fullname: string;
  email: string;
  password: string;
  majorId: string;
}

export interface IRegisterFormData {
  fullname: string;
  email: string;
  password: string;
  repeatPassword: string;
  majorId: string;
}

