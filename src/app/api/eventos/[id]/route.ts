import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

// GET por id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM evento WHERE id = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Erro GET evento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// PUT – atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const existing = await pool.query(
      'SELECT criado_por FROM evento WHERE id = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });
    }
    if (user.tipo !== 'admin' && existing.rows[0].criado_por !== user.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
    }

    const formData = await request.formData();
    const titulo = formData.get('titulo') as string | null;
    const descricao = formData.get('descricao') as string | null;
    const data_evento = formData.get('data_evento') as string | null;
    const local = formData.get('local') as string | null;
    const estado = formData.get('estado') as string | null;
    const imagem = formData.get('imagem') as File | null;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (titulo) {
      updates.push(`titulo = $${paramIndex++}`);
      values.push(titulo);
    }
    if (descricao !== null) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(descricao);
    }
    if (data_evento) {
      updates.push(`data_evento = $${paramIndex++}`);
      values.push(data_evento);
    }
    if (local !== null) {
      updates.push(`local = $${paramIndex++}`);
      values.push(local);
    }
    if (estado) {
      updates.push(`estado = $${paramIndex++}`);
      values.push(estado);
    }
    if (imagem && imagem.size > 0) {
      const imagemPath = await saveFile(imagem, 'eventos');
      updates.push(`imagem_capa = $${paramIndex++}`);
      values.push(imagemPath);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { message: 'Nenhum campo para atualizar' },
        { status: 400 }
      );
    }

    updates.push(`atualizado_em = CURRENT_TIMESTAMP`);
    values.push(id);
    const query = `UPDATE evento SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Erro PUT evento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// DELETE – apenas admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await pool.query(
      'UPDATE evento SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    return NextResponse.json({ success: true, message: 'Evento eliminado' });
  } catch (error) {
    console.error('Erro DELETE evento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}