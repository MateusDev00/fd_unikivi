import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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
    const caminho = doc.caminho_servidor; // já será uma URL pública do Supabase em produção

    // Redireciona para a URL pública (Supabase) ou serve arquivo local em dev
    if (caminho.startsWith('http')) {
      return NextResponse.redirect(caminho);
    }

    // Fallback local (apenas desenvolvimento)
    const { readFile } = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', caminho);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': doc.tipo_mime || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${doc.nome_original}"`,
        'Content-Length': String(doc.tamanho_bytes),
      },
    });
  } catch (error: any) {
    console.error('Erro download:', error);
    return NextResponse.json({ message: 'Erro ao descarregar' }, { status: 500 });
  }
}