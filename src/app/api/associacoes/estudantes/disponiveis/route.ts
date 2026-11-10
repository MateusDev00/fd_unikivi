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
    // Busca estudantes que AINDA NÃO estão associados a esta turma + disciplina
    const result = await pool.query(
      `SELECT u.id, u.nome, u.bilhete, e.numero_estudante, e.curso
       FROM utilizador u
       LEFT JOIN estudante e ON e.id_utilizador = u.id
       WHERE u.tipo = 'estudante'
         AND u.eliminado_em IS NULL
         AND u.id NOT IN (
           SELECT ed.id_estudante
           FROM estudante_disciplina ed
           WHERE ed.id_turma = $1 
             AND ed.id_disciplina = $2 
             AND ed.eliminado_em IS NULL
         )
       ORDER BY u.nome ASC`,
      [turma, disciplina]
    );

    // Log para debug (remove depois)
    console.log(`Estudantes disponíveis para turma ${turma} e disciplina ${disciplina}: ${result.rows.length}`);

    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    console.error('Erro GET estudantes disponíveis:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}