import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const result = await pool.query(`
      SELECT ed.id,
             ed.id_estudante,
             u.nome AS nome_estudante,
             ed.id_disciplina,
             d.nome AS nome_disciplina,
             ed.id_turma,
             t.nome AS nome_turma,
             ed.ano_frequencia,
             ed.semestre,
             ed.estado
      FROM estudante_disciplina ed
      LEFT JOIN utilizador u ON u.id = ed.id_estudante
      LEFT JOIN disciplina d ON d.id = ed.id_disciplina
      LEFT JOIN turma t ON t.id = ed.id_turma
      WHERE ed.eliminado_em IS NULL
      ORDER BY u.nome ASC
    `);
    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    console.error('Erro GET associações estudantes:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id_estudante, id_disciplina, id_turma, ano_frequencia, semestre } =
    await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO estudante_disciplina
        (id_estudante, id_disciplina, id_turma, ano_frequencia, semestre, estado)
       VALUES ($1, $2, $3, $4, $5, 'inscrito') RETURNING *`,
      [id_estudante, id_disciplina, id_turma, ano_frequencia, semestre]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    // 🟢 A tipagem 'any' resolve o erro 18046
    if (error.code === '23505') {
      return NextResponse.json(
        { message: 'Este estudante já está associado a esta turma e disciplina.' },
        { status: 409 }
      );
    }
    console.error('Erro POST associação estudante:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}