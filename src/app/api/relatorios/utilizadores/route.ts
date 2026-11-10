import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(`SELECT id, nome, bilhete, email, tipo, criado_em FROM utilizador WHERE eliminado_em IS NULL ORDER BY nome ASC`);

  const csv = toCSV(result.rows, { id: 'ID', nome: 'Nome', bilhete: 'Bilhete', email: 'Email', tipo: 'Perfil', criado_em: 'Registo' });

  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="utilizadores.csv"' } });
}