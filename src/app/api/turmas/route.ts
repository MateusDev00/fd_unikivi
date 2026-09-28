import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const result = await pool.query('SELECT * FROM turma WHERE eliminado_em IS NULL ORDER BY nome ASC');
  return NextResponse.json({ data: result.rows });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { nome, descricao } = await request.json();
  const result = await pool.query(
    'INSERT INTO turma (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao]
  );
  return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
}