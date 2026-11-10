import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const turma = searchParams.get('turma');
  const disciplina = searchParams.get('disciplina');

  if (!turma || !disciplina) {
    return NextResponse.json(
      { message: 'Turma e disciplina são obrigatórias' },
      { status: 400 }
    );
  }

  try {
    // Busca docentes que AINDA NÃO estão associados a esta turma + disciplina
    const result = await pool.query(
      `SELECT u.id, u.nome, u.bilhete, d.titulacao
       FROM utilizador u
       INNER JOIN docente d ON d.id_utilizador = u.id
       WHERE u.tipo = 'docente'
         AND u.eliminado_em IS NULL
         AND u.id NOT IN (
           SELECT dd.id_docente
           FROM docente_disciplina dd
           WHERE dd.id_turma = $1 AND dd.id_disciplina = $2 AND dd.eliminado_em IS NULL
         )
       ORDER BY u.nome ASC`,
      [turma, disciplina]
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Erro GET docentes disponíveis:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}