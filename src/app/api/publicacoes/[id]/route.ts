import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM publicacao WHERE id = $1 AND eliminado_em IS NULL`,
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Publicação não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Erro GET publicação:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const pub = await pool.query(
      `SELECT criado_por FROM publicacao WHERE id = $1 AND eliminado_em IS NULL`,
      [id]
    );
    if (pub.rowCount === 0) {
      return NextResponse.json({ message: 'Publicação não encontrada' }, { status: 404 });
    }
    if (user.tipo !== 'admin' && pub.rows[0].criado_por !== user.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
    }

    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const conteudo = formData.get('conteudo') as string;
    const estado = formData.get('estado') as string;
    const imagem = formData.get('imagem_capa') as File | null;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (titulo) {
      updates.push(`titulo = $${paramIndex++}`);
      values.push(titulo);
    }
    if (conteudo) {
      updates.push(`conteudo = $${paramIndex++}`);
      values.push(conteudo);
    }
    if (estado) {
      updates.push(`estado = $${paramIndex++}`);
      values.push(estado);
    }
    if (imagem && imagem.size > 0) {
      const imagemPath = await saveFile(imagem, 'publicacoes');
      updates.push(`imagem_capa = $${paramIndex++}`);
      values.push(imagemPath);
    }

    if (updates.length > 0) {
      updates.push(`atualizado_em = CURRENT_TIMESTAMP`);
      values.push(id);
      const query = `UPDATE publicacao SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      const result = await pool.query(query, values);
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ message: 'Nenhum campo para atualizar' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erro PUT publicação:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') {
    return NextResponse.json({ message: 'Apenas administradores' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await pool.query(
      `UPDATE publicacao SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    return NextResponse.json({ success: true, message: 'Publicação eliminada' });
  } catch (error) {
    console.error('Erro DELETE publicação:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}