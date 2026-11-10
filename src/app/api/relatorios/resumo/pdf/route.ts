import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return new Response('Acesso negado', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const dataInicio = searchParams.get('data_inicio') || '';
  const dataFim = searchParams.get('data_fim') || '';

  const filtroData = dataInicio || dataFim
    ? `AND criado_em >= '${dataInicio || '1970-01-01'}' AND criado_em <= '${dataFim || '2100-01-01'}'`
    : '';

  try {
    const [pub, ev, doc, user] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM publicacao WHERE eliminado_em IS NULL ${filtroData}`),
      pool.query(`SELECT COUNT(*) FROM evento WHERE eliminado_em IS NULL ${filtroData}`),
      pool.query(`SELECT COUNT(*) FROM documento WHERE eliminado_em IS NULL ${filtroData}`),
      pool.query(`SELECT COUNT(*) FROM utilizador WHERE eliminado_em IS NULL`),
    ]);

    const resumo = [
      { indicador: 'Publicações', total: parseInt(pub.rows[0].count, 10) },
      { indicador: 'Eventos', total: parseInt(ev.rows[0].count, 10) },
      { indicador: 'Documentos', total: parseInt(doc.rows[0].count, 10) },
      { indicador: 'Utilizadores (Global)', total: parseInt(user.rows[0].count, 10) },
    ];

    const filtros = dataInicio || dataFim
      ? `De: ${dataInicio || '—'} | Até: ${dataFim || '—'}`
      : 'Nenhum';

    const pdfBuffer = await generatePDF({
      title: 'Resumo Estatístico Institucional',
      filtersInfo: filtros,
      data: resumo,
      columns: [
        { key: 'indicador', label: 'Indicador', width: 400, align: 'left' },
        { key: 'total', label: 'Total', width: 300, align: 'center' },
      ],
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resumo_estatistico.pdf"',
      },
    });
  } catch (error) {
    console.error('Erro resumo estatístico:', error);
    return new Response('Erro interno', { status: 500 });
  }
}