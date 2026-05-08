import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bilhete, senha } = loginSchema.parse(body);

    const result = await pool.query(
      `SELECT id, bilhete, nome, senha_hash, tipo FROM utilizador
       WHERE bilhete = $1 AND eliminado_em IS NULL`,
      [bilhete]
    );
    const user = result.rows[0];
    if (!user || !(await comparePassword(senha, user.senha_hash))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = signToken({ id: user.id, bilhete: user.bilhete, tipo: user.tipo });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          bilhete: user.bilhete,
          tipo: user.tipo,
        },
      },
    });
  } catch (error: any) {
    console.error('Erro login:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}