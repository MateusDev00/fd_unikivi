import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';
import crypto from 'crypto';

// GET paginado
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const count = await pool.query(
      'SELECT COUNT(*) FROM documento WHERE eliminado_em IS NULL'
    );
    const total = parseInt(count.rows[0].count, 10);

    const result = await pool.query(
      `SELECT id, titulo, descricao, nome_original, caminho_servidor,
              hash_ficheiro, tipo_mime, tamanho_bytes, categoria, criado_em
       FROM documento WHERE eliminado_em IS NULL
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
  } catch (error: any) {
    console.error('Erro GET documentos:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// POST – criar documento
export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string | null;
    const categoria = formData.get('categoria') as string | null;
    const file = formData.get('documento') as File | null;

    if (!titulo) {
      return NextResponse.json({ message: 'Título obrigatório' }, { status: 400 });
    }
    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'Ficheiro obrigatório' }, { status: 400 });
    }

    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { message: `Tipo não permitido: ${file.type}` },
        { status: 400 }
      );
    }

    const caminho = await saveFile(file, 'documentos', allowedMimes);

    // Calcular hash SHA‑256
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const result = await pool.query(
      `INSERT INTO documento 
       (titulo, descricao, nome_original, caminho_servidor, hash_ficheiro,
        tipo_mime, tamanho_bytes, categoria, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        titulo,
        descricao || null,
        file.name,
        caminho,
        hash,
        file.type,
        file.size,
        categoria || null,
        user.id,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}