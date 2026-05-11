import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function saveFile(file: File, folder: string, allowedMimes?: string[]): Promise<string> {
  // Validação de tipo (se fornecida)
  if (allowedMimes && !allowedMimes.includes(file.type)) {
    throw new Error(`Tipo de ficheiro não permitido: ${file.type}`);
  }

  // Na Vercel, usa /tmp; em desenvolvimento, usa public/uploads
  const baseDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'public');
  const uploadDir = path.join(baseDir, 'uploads', folder);

  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name);
  const filename = crypto.randomBytes(16).toString('hex') + ext;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Retorna o caminho acessível publicamente
  return `/uploads/${folder}/${filename}`;
}