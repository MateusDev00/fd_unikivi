import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) return new Response('Acesso negado', { status: 403 });

  const { searchParams } = new URL(request.url);
  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];

  if (searchParams.get('estado')) { where += ` AND estado = $${params.length + 1}`; params.push(searchParams.get('estado')); }
  if (searchParams.get('search')) { where += ` AND titulo ILIKE $${params.length + 1}`; params.push(`%${searchParams.get('search')}%`); }

  const result = await pool.query(`SELECT id, titulo, local, estado, data_evento FROM evento ${where} ORDER BY data_evento DESC`, params);

  const csv = toCSV(result.rows, { id: 'ID', titulo: 'Título', local: 'Local', estado: 'Estado', data_evento: 'Data' });

  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="eventos.csv"' } });
}