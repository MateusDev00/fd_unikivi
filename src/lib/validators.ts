import { z } from 'zod';

export const loginSchema = z.object({
  bilhete: z.string().min(1),
  senha: z.string().min(1),
});

export const registerSchema = z.object({
  nome: z.string().min(3).max(255),
  bilhete: z.string().min(5).max(50),
  senha: z.string().min(6).max(100),
  tipo: z.enum(['admin', 'estudante', 'docente']),
  numero_estudante: z.string().optional(),
  curso: z.string().optional(),
  ano_ingresso: z.number().int().optional(),
  departamento: z.string().optional(),
  titulacao: z.string().optional(),
  area_especializacao: z.string().nullable().optional(),
});