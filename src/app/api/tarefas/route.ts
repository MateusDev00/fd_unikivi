import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const tarefaSchema = z.object({
  titulo: z.string().min(3).max(255),
  descricao: z.string().optional().nullable(),
  data_abertura: z.string().datetime(),
  data_fechamento: z.string().datetime(),
  arquivos_apoio: z.array(z.string()).optional().default([]),
  instrucoes: z.string().optional().nullable(),
  id_turma: z.number().int().positive(),
  id_disciplina: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;
  const turmaId = searchParams.get('turma');
  const disciplinaId = searchParams.get('disciplina');

  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];
  let paramIndex = 1;

  if (user.tipo === 'docente') {
    where += ` AND id_docente = $${paramIndex}`;
    params.push(user.id);
    paramIndex++;
  } else if (user.tipo === 'estudante') {
    where += ` AND id_turma IN (
      SELECT id_turma FROM estudante_disciplina
      WHERE id_estudante = $${paramIndex}
    )`;
    params.push(user.id);
    paramIndex++;
  } else {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  if (turmaId) {
    where += ` AND id_turma = $${paramIndex}`;
    params.push(turmaId);
    paramIndex++;
  }
  if (disciplinaId) {
    where += ` AND id_disciplina = $${paramIndex}`;
    params.push(disciplinaId);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) FROM tarefa ${where}`;
  const totalResult = await pool.query(countQuery, params);
  const total = parseInt(totalResult.rows[0].count, 10);

  const dataQuery = `
    SELECT t.*, d.nome as nome_disciplina, tur.nome as nome_turma
    FROM tarefa t
    LEFT JOIN disciplina d ON d.id = t.id_disciplina
    LEFT JOIN turma tur ON tur.id = t.id_turma
    ${where}
    ORDER BY t.data_abertura DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  params.push(limit, offset);
  const result = await pool.query(dataQuery, params);

  return NextResponse.json({
    data: result.rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'docente') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = tarefaSchema.parse(body);

    // Verificar associação docente-turma-disciplina
    const associacao = await pool.query(
      `SELECT 1 FROM docente_disciplina
       WHERE id_docente = $1 AND id_turma = $2 AND id_disciplina = $3`,
      [user.id, data.id_turma, data.id_disciplina]
    );
    if (associacao.rowCount === 0) {
      return NextResponse.json(
        { message: 'Não está associado a esta turma/disciplina' },
        { status: 400 }
      );
    }

    const uuid = randomUUID();

    const result = await pool.query(
      `INSERT INTO tarefa (uuid, titulo, descricao, data_abertura, data_fechamento,
                           arquivos_apoio, instrucoes, id_turma, id_disciplina, id_docente)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        uuid,
        data.titulo,
        data.descricao || null,
        data.data_abertura,
        data.data_fechamento,
        JSON.stringify(data.arquivos_apoio),
        data.instrucoes || null,
        data.id_turma,
        data.id_disciplina,
        user.id,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}