import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria') || '';
  const search = searchParams.get('search') || '';
  const dataInicio = searchParams.get('data_inicio') || '';
  const dataFim = searchParams.get('data_fim') || '';

  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];
  let idx = 1;

  if (categoria) { where += ` AND categoria = $${idx++}`; params.push(categoria); }
  if (search) { where += ` AND titulo ILIKE $${idx++}`; params.push(`%${search}%`); }
  if (dataInicio) { where += ` AND criado_em >= $${idx++}`; params.push(dataInicio); }
  if (dataFim) { where += ` AND criado_em <= $${idx++}`; params.push(dataFim); }

  try {
    const result = await pool.query(
      `SELECT id, titulo, nome_original, categoria, tipo_mime,
              ROUND(tamanho_bytes / 1024.0, 2) AS tamanho_kb, criado_em
       FROM documento ${where} ORDER BY criado_em DESC`,
      params
    );

    const csv = toCSV(result.rows, {
      id: 'ID',
      titulo: 'Título',
      nome_original: 'Ficheiro',
      categoria: 'Categoria',
      tipo_mime: 'Tipo',
      tamanho_kb: 'Tamanho (KB)',
      criado_em: 'Data de Upload',
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="relatorio_documentos.csv"',
      },
    });
  } catch (error) {
    console.error('Erro relatório documentos:', error);
    return new Response('Erro interno', { status: 500 });
  }
}