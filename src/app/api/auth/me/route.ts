import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const user = getAuthUser(request as any);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, nome, bilhete, tipo FROM utilizador WHERE id = $1`,
      [user.id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Utilizador não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Erro me:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}