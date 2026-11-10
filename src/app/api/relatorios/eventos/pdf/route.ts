import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(`SELECT id, titulo, local, estado, data_evento FROM evento WHERE eliminado_em IS NULL ORDER BY data_evento DESC`);

  const pdf = await generatePDF({
    title: 'Relatório de Eventos',
    filtersInfo: 'Nenhum',
    data: result.rows,
    columns: [
      { key: 'id', label: 'ID', width: 60, align: 'center' },
      { key: 'titulo', label: 'Título', width: 350, align: 'left' },
      { key: 'local', label: 'Local', width: 200, align: 'left' },
      { key: 'estado', label: 'Estado', width: 120, align: 'center' },
      { key: 'data_evento', label: 'Data', width: 200, align: 'right' },
    ],
  });

  return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="eventos.pdf"' } });
}