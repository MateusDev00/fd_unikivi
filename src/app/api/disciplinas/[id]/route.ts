import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  const result = await pool.query('SELECT * FROM disciplina WHERE id = $1 AND eliminado_em IS NULL', [id]);
  if (result.rowCount === 0) return NextResponse.json({ message: 'Disciplina não encontrada' }, { status: 404 });
  return NextResponse.json({ data: result.rows[0] });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  const { nome, codigo, descricao, carga_horaria, ano_lectivo } = await request.json();

  await pool.query(
    `UPDATE disciplina SET nome = $1, codigo = $2, descricao = $3, carga_horaria = $4, ano_lectivo = $5, atualizado_em = CURRENT_TIMESTAMP WHERE id = $6`,
    [nome, codigo, descricao, carga_horaria, ano_lectivo, id]
  );
  const updated = await pool.query('SELECT * FROM disciplina WHERE id = $1', [id]);
  return NextResponse.json({ success: true, data: updated.rows[0] });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  await pool.query('UPDATE disciplina SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  return NextResponse.json({ success: true, message: 'Disciplina removida' });
}