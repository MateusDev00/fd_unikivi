import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

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
  const filtrosTexto: string[] = [];

  if (estado) { where += ` AND estado = $${idx++}`; params.push(estado); filtrosTexto.push(`Estado: ${estado}`); }
  if (search) { where += ` AND titulo ILIKE $${idx++}`; params.push(`%${search}%`); filtrosTexto.push(`Pesquisa: "${search}"`); }
  if (dataInicio) { where += ` AND criado_em >= $${idx++}`; params.push(dataInicio); filtrosTexto.push(`De: ${dataInicio}`); }
  if (dataFim) { where += ` AND criado_em <= $${idx++}`; params.push(dataFim); filtrosTexto.push(`Até: ${dataFim}`); }

  try {
    const result = await pool.query(
      `SELECT id, titulo, estado, criado_em FROM publicacao ${where} ORDER BY criado_em DESC`,
      params
    );

    const pdfBuffer = await generatePDF({
      title: 'Relatório de Publicações',
      filtersInfo: filtrosTexto.join(' | '),
      data: result.rows,
      columns: [
        { key: 'id', label: 'ID', width: 50 },
        { key: 'titulo', label: 'Título', width: 400 },
        { key: 'estado', label: 'Estado', width: 100 },
        { key: 'criado_em', label: 'Data de Criação', width: 200 },
      ],
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="relatorio_publicacoes.pdf"',
      },
    });
  } catch (error) {
    console.error('Erro relatório PDF publicações:', error);
    return new Response('Erro interno', { status: 500 });
  }
}