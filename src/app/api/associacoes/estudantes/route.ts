import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const result = await pool.query(`
    SELECT es.id, es.id_estudante, u.nome as nome_estudante,
           es.id_disciplina, d.nome as nome_disciplina,
           es.id_turma, t.nome as nome_turma,
           es.ano_frequencia, es.semestre, es.estado
    FROM estudante_disciplina es
    LEFT JOIN utilizador u ON u.id = es.id_estudante
    LEFT JOIN disciplina d ON d.id = es.id_disciplina
    LEFT JOIN turma t ON t.id = es.id_turma
    WHERE es.eliminado_em IS NULL
  `);

  return NextResponse.json({ data: result.rows });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id_estudante, id_disciplina, id_turma, ano_frequencia, semestre } = await request.json();

  const result = await pool.query(
    `INSERT INTO estudante_disciplina (id_estudante, id_disciplina, id_turma, ano_frequencia, semestre, estado)
     VALUES ($1, $2, $3, $4, $5, 'inscrito') RETURNING *`,
    [id_estudante, id_disciplina, id_turma, ano_frequencia, semestre]
  );
  return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
}