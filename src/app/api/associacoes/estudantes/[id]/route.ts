import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const { estado } = await request.json();

  try {
    await pool.query(
      `UPDATE estudante_disciplina SET estado = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2`,
      [estado, id]
    );
    const updated = await pool.query(
      'SELECT * FROM estudante_disciplina WHERE id = $1',
      [id]
    );
    return NextResponse.json({ success: true, data: updated.rows[0] });
  } catch (error: any) {
    console.error('Erro PUT associação estudante:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

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
    // 🟢 SOFT DELETE: Apenas marca como eliminado para manter o histórico
    await pool.query(
      'UPDATE estudante_disciplina SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    return NextResponse.json({ success: true, message: 'Associação removida com sucesso' });
  } catch (error: any) {
    console.error('Erro DELETE associação estudante:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}