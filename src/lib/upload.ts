import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function saveFile(
  file: File,
  folder: string,
  mimes?: string[]
): Promise<string> {
  // Se fornecida uma lista de tipos permitidos, valida o ficheiro
  if (mimes && mimes.length > 0 && !mimes.includes(file.type)) {
    throw new Error(`Tipo de ficheiro não permitido: ${file.type}`);
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name);
  const filename = crypto.randomBytes(16).toString('hex') + ext;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}