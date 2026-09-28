import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const result = await pool.query(`
    SELECT dd.id, dd.id_docente, u.nome as nome_docente,
           dd.id_disciplina, d.nome as nome_disciplina,
           dd.id_turma, t.nome as nome_turma,
           dd.cargo, dd.nivel_academico
    FROM docente_disciplina dd
    LEFT JOIN utilizador u ON u.id = dd.id_docente
    LEFT JOIN disciplina d ON d.id = dd.id_disciplina
    LEFT JOIN turma t ON t.id = dd.id_turma
    WHERE dd.eliminado_em IS NULL
  `);

  return NextResponse.json({ data: result.rows });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const { id_docente, id_disciplina, id_turma, cargo, nivel_academico } = await request.json();

    // Validar se o docente existe
    const docenteExists = await pool.query('SELECT 1 FROM docente WHERE id_utilizador = $1', [id_docente]);
    if (docenteExists.rowCount === 0) return NextResponse.json({ message: 'Docente não encontrado' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO docente_disciplina (id_docente, id_disciplina, id_turma, cargo, nivel_academico)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_docente, id_disciplina, id_turma, cargo, nivel_academico]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Erro ao associar docente:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}