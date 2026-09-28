import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  const { cargo, nivel_academico } = await request.json();

  try {
    await pool.query(
      'UPDATE docente_disciplina SET cargo = $1, nivel_academico = $2, atualizado_em = CURRENT_TIMESTAMP WHERE id = $3',
      [cargo, nivel_academico, id]
    );
    const updated = await pool.query('SELECT * FROM docente_disciplina WHERE id = $1', [id]);
    return NextResponse.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  try {
    await pool.query('DELETE FROM docente_disciplina WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Associação removida' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}