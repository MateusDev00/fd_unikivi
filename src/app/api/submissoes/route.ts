import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

// GET – lista submissões (docente vê da sua tarefa, estudante vê as suas)
export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tarefaUuid = searchParams.get('tarefa'); // recebe UUID

  try {
    let result;
    if (user.tipo === 'docente') {
      if (!tarefaUuid) {
        return NextResponse.json({ message: 'Informe a tarefa' }, { status: 400 });
      }
      // Verificar se a tarefa pertence ao docente
      const tarefa = await pool.query(
        'SELECT id FROM tarefa WHERE uuid = $1 AND id_docente = $2 AND eliminado_em IS NULL',
        [tarefaUuid, user.id]
      );
      if (tarefa.rowCount === 0) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
      }

      result = await pool.query(
        `SELECT s.*, u.nome as nome_estudante
         FROM submissao s
         INNER JOIN utilizador u ON u.id = s.id_estudante
         INNER JOIN tarefa t ON t.id = s.id_tarefa
         WHERE t.uuid = $1 AND s.eliminado_em IS NULL
         ORDER BY s.data_submissao DESC`,
        [tarefaUuid]
      );
    } else if (user.tipo === 'estudante') {
      result = await pool.query(
        `SELECT s.*, t.titulo as titulo_tarefa
         FROM submissao s
         INNER JOIN tarefa t ON t.id = s.id_tarefa
         WHERE s.id_estudante = $1 AND s.eliminado_em IS NULL
         ORDER BY s.data_submissao DESC`,
        [user.id]
      );
    } else {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Erro GET submissões:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// POST – estudante submete PDF
export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'estudante') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const tarefaUuid = formData.get('tarefa_uuid') as string;
    const arquivo = formData.get('arquivo') as File | null;
    const observacoes = formData.get('observacoes') as string | null;

    // Buscar a tarefa pelo UUID
    const tarefaRes = await pool.query(
      'SELECT * FROM tarefa WHERE uuid = $1 AND eliminado_em IS NULL',
      [tarefaUuid]
    );
    if (tarefaRes.rowCount === 0) {
      return NextResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }

    const tarefa = tarefaRes.rows[0];
    const agora = new Date();
    const abertura = new Date(tarefa.data_abertura);
    const fechamento = new Date(tarefa.data_fechamento);

    if (agora < abertura || agora > fechamento) {
      return NextResponse.json(
        { message: 'Fora do período de submissão' },
        { status: 400 }
      );
    }

    // Verificar se o estudante está matriculado na turma/disciplina
    const matricula = await pool.query(
      `SELECT 1 FROM estudante_disciplina
       WHERE id_estudante = $1 AND id_turma = $2 AND id_disciplina = $3`,
      [user.id, tarefa.id_turma, tarefa.id_disciplina]
    );
    if (matricula.rowCount === 0) {
      return NextResponse.json({ message: 'Não matriculado nesta turma' }, { status: 403 });
    }

    if (!arquivo || arquivo.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Ficheiro PDF obrigatório' }, { status: 400 });
    }

    const caminho = await saveFile(arquivo, 'submissoes', ['application/pdf']);

    const result = await pool.query(
      `INSERT INTO submissao (id_tarefa, id_estudante, arquivo_pdf, observacoes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id_tarefa, id_estudante)
       DO UPDATE SET arquivo_pdf = $3, observacoes = $4, status = 'enviada', data_submissao = now(), atualizado_em = now()
       RETURNING *`,
      [tarefa.id, user.id, caminho, observacoes || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Erro POST submissão:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}