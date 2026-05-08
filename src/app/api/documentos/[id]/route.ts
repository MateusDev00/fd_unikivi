import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET metadados
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM documento WHERE id = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Documento não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Erro GET documento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// PUT – atualizar metadados
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
      'SELECT criado_por FROM documento WHERE id = $1 AND eliminado_em IS NULL',
      [id]
    );
    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'Documento não encontrado' }, { status: 404 });
    }
    if (user.tipo !== 'admin' && existing.rows[0].criado_por !== user.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descricao, categoria } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (titulo) {
      updates.push(`titulo = $${paramIndex++}`);
      values.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(descricao);
    }
    if (categoria !== undefined) {
      updates.push(`categoria = $${paramIndex++}`);
      values.push(categoria);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'Nenhum campo para atualizar' }, { status: 400 });
    }

    updates.push(`atualizado_em = CURRENT_TIMESTAMP`);
    values.push(id);
    const query = `UPDATE documento SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Erro PUT documento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// DELETE – soft delete
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
      'UPDATE documento SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    return NextResponse.json({ success: true, message: 'Documento eliminado' });
  } catch (error) {
    console.error('Erro DELETE documento:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}