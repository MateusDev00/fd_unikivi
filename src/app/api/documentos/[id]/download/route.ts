import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM documento WHERE id = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Documento não encontrado' }, { status: 404 });
    }

    const doc = result.rows[0];
    const filePath = path.join(process.cwd(), 'public', doc.caminho_servidor);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': doc.tipo_mime,
        'Content-Disposition': `attachment; filename="${doc.nome_original}"`,
        'Content-Length': String(doc.tamanho_bytes),
      },
    });
  } catch (error: any) {
    console.error('Erro download:', error);
    return NextResponse.json({ message: 'Erro ao descarregar' }, { status: 500 });
  }
}