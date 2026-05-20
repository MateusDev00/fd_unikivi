import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser, comparePassword, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual obrigatória'),
  novaSenha: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
});

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { senhaAtual, novaSenha } = schema.parse(body);

    const result = await pool.query(
      'SELECT senha_hash FROM utilizador WHERE id = $1 AND eliminado_em IS NULL',
      [user.id]
    );
    const dbUser = result.rows[0];
    if (!dbUser || !(await comparePassword(senhaAtual, dbUser.senha_hash))) {
      return NextResponse.json({ message: 'Senha atual incorreta' }, { status: 400 });
    }

    const novoHash = await hashPassword(novaSenha);
    await pool.query('UPDATE utilizador SET senha_hash = $1 WHERE id = $2', [novoHash, user.id]);

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}