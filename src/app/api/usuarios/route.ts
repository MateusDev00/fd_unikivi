import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const createSchema = z.object({
  nome: z.string().min(3).max(255),
  bilhete: z.string().min(5).max(50),
  email: z.string().email().optional().nullable(),
  senha: z.string().min(6).max(100),
  tipo: z.enum(['admin', 'estudante', 'docente']),
  numero_estudante: z.string().optional(),
  curso: z.string().optional(),
  ano_ingresso: z.number().int().optional(),
  departamento: z.string().optional(),
  titulacao: z.string().optional(),
  area_especializacao: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  const userAuth = getAuthUser(request);
  if (!userAuth || userAuth.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;
  const tipo = searchParams.get('tipo') || '';
  const search = searchParams.get('search') || '';

  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];
  let paramIndex = 1;

  if (tipo) {
    where += ` AND tipo = $${paramIndex}`;
    params.push(tipo);
    paramIndex++;
  }
  if (search) {
    where += ` AND (nome ILIKE $${paramIndex} OR bilhete ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) FROM utilizador ${where}`;
  const totalResult = await pool.query(countQuery, params);
  const total = parseInt(totalResult.rows[0].count, 10);

  const dataQuery = `SELECT id, nome, bilhete, email, tipo, criado_em FROM utilizador ${where} ORDER BY criado_em DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);
  const result = await pool.query(dataQuery, params);

  return NextResponse.json({
    data: result.rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const userAuth = getAuthUser(request);
  if (!userAuth || userAuth.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    // Verificar bilhete duplicado
    const exists = await pool.query('SELECT 1 FROM utilizador WHERE bilhete = $1 AND eliminado_em IS NULL', [data.bilhete]);
    if ((exists.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: 'Bilhete já registado' }, { status: 409 });
    }

    const senha_hash = await hashPassword(data.senha);
    const userResult = await pool.query(
      `INSERT INTO utilizador (nome, bilhete, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [data.nome, data.bilhete, data.email || null, senha_hash, data.tipo]
    );
    const userId = userResult.rows[0].id;

    if (data.tipo === 'estudante' && data.numero_estudante) {
      await pool.query(
        `INSERT INTO estudante (id_utilizador, numero_estudante, curso, ano_ingresso)
         VALUES ($1, $2, $3, $4)`,
        [userId, data.numero_estudante, data.curso, data.ano_ingresso]
      );
    } else if (data.tipo === 'docente' && data.departamento) {
      await pool.query(
        `INSERT INTO docente (id_utilizador, departamento, titulacao, area_especializacao)
         VALUES ($1, $2, $3, $4)`,
        [userId, data.departamento, data.titulacao, data.area_especializacao]
      );
    }

    return NextResponse.json({ success: true, data: { id: userId } }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar utilizador:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}