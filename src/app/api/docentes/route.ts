import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const search = searchParams.get('search') || '';

  let where = `WHERE u.eliminado_em IS NULL AND u.tipo = 'docente'`;
  const params: any[] = [];
  let paramIndex = 1;

  if (search) {
    where += ` AND (u.nome ILIKE $${paramIndex} OR d.departamento ILIKE $${paramIndex} OR d.area_especializacao ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  try {
    const countQuery = `
      SELECT COUNT(*)
      FROM utilizador u
      INNER JOIN docente d ON d.id_utilizador = u.id
      ${where}
    `;
    const totalResult = await pool.query(countQuery, params);
    const total = parseInt(totalResult.rows[0].count, 10);

    const dataQuery = `
      SELECT u.id, u.nome, u.email, u.criado_em,
             d.departamento, d.titulacao, d.area_especializacao,
             d.biografia, d.foto, d.website, d.redes_sociais
      FROM utilizador u
      INNER JOIN docente d ON d.id_utilizador = u.id
      ${where}
      ORDER BY u.nome ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    const result = await pool.query(dataQuery, params);

    return NextResponse.json({
      data: result.rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error('Erro GET docentes:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}