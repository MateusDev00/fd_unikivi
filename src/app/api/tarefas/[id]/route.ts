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
      `SELECT t.*, d.nome as nome_disciplina, tur.nome as nome_turma
       FROM tarefa t
       LEFT JOIN disciplina d ON d.id = t.id_disciplina
       LEFT JOIN turma tur ON tur.id = t.id_turma
       WHERE t.uuid = $1 AND t.eliminado_em IS NULL`,
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }

    const tarefa = result.rows[0];

    // Validação de acesso
    if (user.tipo === 'docente' && tarefa.id_docente !== user.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
    }
    if (user.tipo === 'estudante') {
      const matriculado = await pool.query(
        `SELECT 1 FROM estudante_disciplina
         WHERE id_estudante = $1 AND id_turma = $2 AND id_disciplina = $3`,
        [user.id, tarefa.id_turma, tarefa.id_disciplina]
      );
      if (matriculado.rowCount === 0) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
      }
    }

    return NextResponse.json({ data: tarefa });
  } catch (error) {
    console.error('Erro GET tarefa:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'docente') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const { titulo, descricao, data_abertura, data_fechamento, arquivos_apoio, instrucoes } = await request.json();

  try {
    // Verificar se a tarefa pertence ao docente
    const tarefa = await pool.query(
      'SELECT * FROM tarefa WHERE uuid = $1 AND id_docente = $2 AND eliminado_em IS NULL',
      [id, user.id]
    );
    if (tarefa.rowCount === 0) {
      return NextResponse.json({ message: 'Tarefa não encontrada ou não autorizado' }, { status: 404 });
    }

    await pool.query(
      `UPDATE tarefa SET
        titulo = $1,
        descricao = $2,
        data_abertura = $3,
        data_fechamento = $4,
        arquivos_apoio = $5,
        instrucoes = $6,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE uuid = $7`,
      [titulo, descricao, data_abertura, data_fechamento, JSON.stringify(arquivos_apoio), instrucoes, id]
    );

    const updated = await pool.query('SELECT * FROM tarefa WHERE uuid = $1', [id]);
    return NextResponse.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    console.error('Erro PUT tarefa:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'docente') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await pool.query(
      'UPDATE tarefa SET eliminado_em = CURRENT_TIMESTAMP WHERE uuid = $1 AND id_docente = $2',
      [id, user.id]
    );
    return NextResponse.json({ success: true, message: 'Tarefa removida' });
  } catch (error) {
    console.error('Erro DELETE tarefa:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}