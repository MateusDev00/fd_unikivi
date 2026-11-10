import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const tabela = searchParams.get('tabela') || '';
  const acao = searchParams.get('acao') || '';
  const utilizadorId = searchParams.get('utilizador') || '';
  const dataInicio = searchParams.get('data_inicio') || '';
  const dataFim = searchParams.get('data_fim') || '';

  let where = 'WHERE 1=1';
  const params: any[] = [];
  let idx = 1;

  if (tabela) { where += ` AND a.tabela_afetada = $${idx++}`; params.push(tabela); }
  if (acao) { where += ` AND a.acao = $${idx++}`; params.push(acao); }
  if (utilizadorId) { where += ` AND a.utilizador_id = $${idx++}`; params.push(utilizadorId); }
  if (dataInicio) { where += ` AND a.data_operacao >= $${idx++}`; params.push(dataInicio); }
  if (dataFim) { where += ` AND a.data_operacao <= $${idx++}`; params.push(dataFim); }

  try {
    const result = await pool.query(
      `SELECT a.id, a.tabela_afetada, a.id_registro, a.acao,
              u.nome AS utilizador, a.data_operacao
       FROM auditoria a
       LEFT JOIN utilizador u ON u.id = a.utilizador_id
       ${where}
       ORDER BY a.data_operacao DESC
       LIMIT 5000`, // Limite para não estourar a memória
      params
    );

    const csv = toCSV(result.rows, {
      id: 'ID',
      tabela_afetada: 'Tabela',
      id_registro: 'Registo',
      acao: 'Ação',
      utilizador: 'Utilizador',
      data_operacao: 'Data',
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="relatorio_auditoria.csv"',
      },
    });
  } catch (error) {
    console.error('Erro relatório auditoria:', error);
    return new Response('Erro interno', { status: 500 });
  }
}