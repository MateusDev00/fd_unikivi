import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { z } from 'zod';

const disciplinaSchema = z.object({
  nome: z.string().min(3).max(255),
  codigo: z.string().min(2).max(50),
  descricao: z.string().optional().nullable(),
  carga_horaria: z.number().int().optional().nullable(),
  ano_lectivo: z.number().int(),
});

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const count = await pool.query('SELECT COUNT(*) FROM disciplina WHERE eliminado_em IS NULL');
    const total = parseInt(count.rows[0].count, 10);

    const result = await pool.query(
      `SELECT * FROM disciplina WHERE eliminado_em IS NULL ORDER BY nome ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return NextResponse.json({
      data: result.rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = disciplinaSchema.parse(body);

    const result = await pool.query(
      `INSERT INTO disciplina (nome, codigo, descricao, carga_horaria, ano_lectivo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.nome, data.codigo, data.descricao || null, data.carga_horaria || null, data.ano_lectivo]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar disciplina:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}