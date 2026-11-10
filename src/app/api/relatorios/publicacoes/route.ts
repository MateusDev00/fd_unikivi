import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return new Response('Acesso negado', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const estado = searchParams.get('estado') || '';
  const search = searchParams.get('search') || '';
  const dataInicio = searchParams.get('data_inicio') || '';
  const dataFim = searchParams.get('data_fim') || '';

  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];
  let idx = 1;

  if (estado) { where += ` AND estado = $${idx++}`; params.push(estado); }
  if (search) { where += ` AND titulo ILIKE $${idx++}`; params.push(`%${search}%`); }
  if (dataInicio) { where += ` AND criado_em >= $${idx++}`; params.push(dataInicio); }
  if (dataFim) { where += ` AND criado_em <= $${idx++}`; params.push(dataFim); }

  try {
    const result = await pool.query(
      `SELECT id, titulo, estado, criado_em FROM publicacao ${where} ORDER BY criado_em DESC`,
      params
    );

    const csv = toCSV(result.rows, {
      id: 'ID',
      titulo: 'Título',
      estado: 'Estado',
      criado_em: 'Data de Criação',
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="relatorio_publicacoes.csv"',
      },
    });
  } catch (error) {
    console.error('Erro relatório publicações:', error);
    return new Response('Erro interno', { status: 500 });
  }
}