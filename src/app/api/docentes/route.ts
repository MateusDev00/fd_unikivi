import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET público – retorna biografia e dados profissionais
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT u.id, u.nome, u.email, d.departamento, d.titulacao,
              d.area_especializacao, d.biografia, d.foto, d.website, d.redes_sociais,
              u.criado_em
       FROM utilizador u
       INNER JOIN docente d ON d.id_utilizador = u.id
       WHERE u.id = $1 AND u.eliminado_em IS NULL AND u.tipo = 'docente'`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Docente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Erro GET docente:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// PUT – protegido (apenas o próprio docente ou admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userAuth = getAuthUser(request);
  if (!userAuth || (userAuth.tipo !== 'admin' && userAuth.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;

  // Apenas o próprio docente ou admin pode editar
  if (userAuth.tipo !== 'admin' && userAuth.id !== Number(id)) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
  }

  const { biografia, foto, website, redes_sociais } = await request.json();

  try {
    await pool.query(
      `UPDATE docente SET
        biografia = $1,
        foto = $2,
        website = $3,
        redes_sociais = $4,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_utilizador = $5`,
      [biografia || null, foto || null, website || null, redes_sociais || {}, id]
    );

    const updated = await pool.query(
      `SELECT u.id, u.nome, d.departamento, d.titulacao,
              d.area_especializacao, d.biografia, d.foto, d.website, d.redes_sociais
       FROM utilizador u
       INNER JOIN docente d ON d.id_utilizador = u.id
       WHERE u.id = $1`,
      [id]
    );

    return NextResponse.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    console.error('Erro PUT docente:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}