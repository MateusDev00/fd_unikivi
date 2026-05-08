import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const count = await pool.query(
    `SELECT COUNT(*) FROM publicacao WHERE eliminado_em IS NULL`
  );
  const total = parseInt(count.rows[0].count, 10);

  const result = await pool.query(
    `SELECT * FROM publicacao WHERE eliminado_em IS NULL
     ORDER BY criado_em DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return NextResponse.json({
    data: result.rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const conteudo = formData.get('conteudo') as string;
    const estado = (formData.get('estado') as string) || 'rascunho';
    const imagem = formData.get('imagem_capa') as File | null;

    if (!titulo) {
      return NextResponse.json({ message: 'Título obrigatório' }, { status: 400 });
    }

    const slug = titulo.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    let imagemPath: string | null = null;
    if (imagem && imagem.size > 0) {
      imagemPath = await saveFile(imagem, 'publicacoes');
    }

    const result = await pool.query(
      `INSERT INTO publicacao (titulo, slug, conteudo, imagem_capa, estado, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titulo, slug, conteudo, imagemPath, estado, user.id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar publicação:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}