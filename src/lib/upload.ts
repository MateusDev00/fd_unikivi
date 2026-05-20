import { supabase } from './supabase';

export async function saveFile(
  file: File,
  folder: string,
  allowedMimes?: string[]
): Promise<string> {
  if (allowedMimes && !allowedMimes.includes(file.type)) {
    throw new Error(`Tipo de ficheiro não permitido: ${file.type}`);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('imagens') // nome do bucket no Supabase
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('imagens')
    .getPublicUrl(filePath);

  return urlData.publicUrl; // retorna a URL pública completa
}