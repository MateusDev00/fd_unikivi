import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

// GET paginado
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const count = await pool.query(
      'SELECT COUNT(*) FROM evento WHERE eliminado_em IS NULL'
    );
    const total = parseInt(count.rows[0].count, 10);

    const result = await pool.query(
      `SELECT * FROM evento WHERE eliminado_em IS NULL
       ORDER BY data_evento DESC LIMIT $1 OFFSET $2`,
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
  } catch (error: any) {
    console.error('Erro GET eventos:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// POST – criar evento (imagem obrigatória)
export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string | null;
    const data_evento = formData.get('data_evento') as string;
    const local = formData.get('local') as string | null;
    const estado = (formData.get('estado') as string) || 'futuro';
    const imagem = formData.get('imagem') as File | null;

    if (!titulo || !data_evento) {
      return NextResponse.json(
        { message: 'Título e data são obrigatórios' },
        { status: 400 }
      );
    }
    if (!imagem || imagem.size === 0) {
      return NextResponse.json(
        { message: 'A fotografia do evento é obrigatória' },
        { status: 400 }
      );
    }

    const imagemPath = await saveFile(imagem, 'eventos', [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]);

    const slug =
      titulo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();

    const result = await pool.query(
      `INSERT INTO evento (titulo, slug, descricao, data_evento, local, estado, imagem_capa, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [titulo, slug, descricao, data_evento, local, estado, imagemPath, user.id]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}