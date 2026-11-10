import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  try {
    const result = await pool.query(`
      SELECT dd.id, dd.id_docente, u.nome AS nome_docente,
             dd.id_disciplina, d.nome AS nome_disciplina,
             dd.id_turma, t.nome AS nome_turma,
             dd.cargo, dd.nivel_academico
      FROM docente_disciplina dd
      LEFT JOIN utilizador u ON u.id = dd.id_docente
      LEFT JOIN disciplina d ON d.id = dd.id_disciplina
      LEFT JOIN turma t ON t.id = dd.id_turma
      WHERE dd.eliminado_em IS NULL
      ORDER BY u.nome ASC
    `);
    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id_docente, id_disciplina, id_turma, cargo, nivel_academico } = await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO docente_disciplina (id_docente, id_disciplina, id_turma, cargo, nivel_academico)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_docente, id_disciplina, id_turma, cargo, nivel_academico]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Este docente já está associado a esta turma e disciplina.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}