import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params; // id é a UUID da tarefa

  try {
    const result = await pool.query(
      `SELECT i.*, u.nome as nome_remetente
       FROM interacao_tarefa i
       INNER JOIN tarefa t ON t.id = i.id_tarefa
       INNER JOIN utilizador u ON u.id = CASE WHEN i.enviado_por = 'docente' THEN i.id_docente ELSE i.id_estudante END
       WHERE t.uuid = $1
       ORDER BY i.data_envio ASC`,
      [id]
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Erro GET interações:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params; // UUID da tarefa
  const { mensagem, id_estudante } = await request.json();

  if (!mensagem || mensagem.trim().length === 0) {
    return NextResponse.json({ message: 'Mensagem vazia' }, { status: 400 });
  }

  try {
    const tarefaRes = await pool.query(
      'SELECT * FROM tarefa WHERE uuid = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (tarefaRes.rowCount === 0) {
      return NextResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }

    const tarefa = tarefaRes.rows[0];
    const agora = new Date();
    const abertura = new Date(tarefa.data_abertura);
    const fechamento = new Date(tarefa.data_fechamento);

    if (agora < abertura || agora > fechamento) {
      return NextResponse.json({ message: 'Interação fechada' }, { status: 400 });
    }

    let id_docente: number;
    let id_estudanteFinal: number;
    let enviado_por: 'docente' | 'estudante';

    if (user.tipo === 'docente') {
      if (tarefa.id_docente !== user.id) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
      }
      if (!id_estudante) {
        return NextResponse.json({ message: 'Estudante não informado' }, { status: 400 });
      }
      id_estudanteFinal = Number(id_estudante);
      id_docente = user.id;
      enviado_por = 'docente';
    } else if (user.tipo === 'estudante') {
      id_estudanteFinal = user.id;
      id_docente = tarefa.id_docente;
      enviado_por = 'estudante';
    } else {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    const result = await pool.query(
      `INSERT INTO interacao_tarefa (id_tarefa, id_estudante, id_docente, mensagem, enviado_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tarefa.id, id_estudanteFinal, id_docente, mensagem, enviado_por]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Erro POST interação:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}