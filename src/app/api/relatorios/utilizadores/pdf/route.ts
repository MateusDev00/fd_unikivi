import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(`SELECT id, nome, bilhete, tipo FROM utilizador WHERE eliminado_em IS NULL ORDER BY nome ASC`);

  const pdf = await generatePDF({
    title: 'Relatório de Utilizadores',
    filtersInfo: 'Nenhum',
    data: result.rows,
    columns: [
      { key: 'id', label: 'ID', width: 60, align: 'center' },
      { key: 'nome', label: 'Nome Completo', width: 350, align: 'left' },
      { key: 'bilhete', label: 'Nº Bilhete', width: 200, align: 'left' },
      { key: 'tipo', label: 'Perfil', width: 150, align: 'center' },
    ],
  });

  return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="utilizadores.pdf"' } });
}