import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Verificar bilhete duplicado
    const exists = await pool.query(
      'SELECT 1 FROM utilizador WHERE bilhete = $1',
      [data.bilhete]
    );
    if ((exists.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: 'Bilhete já registado' }, { status: 409 });
    }

    const senha_hash = await hashPassword(data.senha);
    const userResult = await pool.query(
      `INSERT INTO utilizador (nome, bilhete, senha_hash, tipo)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [data.nome, data.bilhete, senha_hash, data.tipo]
    );
    const userId = userResult.rows[0].id;

    // Inserir dados específicos
    if (data.tipo === 'estudante') {
      await pool.query(
        `INSERT INTO estudante (id_utilizador, numero_estudante, curso, ano_ingresso)
         VALUES ($1, $2, $3, $4)`,
        [userId, data.numero_estudante, data.curso, data.ano_ingresso]
      );
    } else if (data.tipo === 'docente') {
      await pool.query(
        `INSERT INTO docente (id_utilizador, departamento, titulacao, area_especializacao)
         VALUES ($1, $2, $3, $4)`,
        [userId, data.departamento, data.titulacao, data.area_especializacao]
      );
    }

    return NextResponse.json({ success: true, data: { id: userId } }, { status: 201 });
  } catch (error: any) {
    console.error('Erro registo:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}