import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  nome: z.string().min(3).max(255).optional(),
  bilhete: z.string().min(5).max(50).optional(),
  email: z.string().email().optional().nullable(),
  senha: z.string().min(6).max(100).optional(),
  tipo: z.enum(['admin', 'estudante', 'docente']).optional(),
  numero_estudante: z.string().optional(),
  curso: z.string().optional(),
  ano_ingresso: z.number().int().optional(),
  departamento: z.string().optional(),
  titulacao: z.string().optional(),
  area_especializacao: z.string().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userAuth = getAuthUser(request);
  if (!userAuth || userAuth.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const result = await pool.query(
    `SELECT id, nome, bilhete, email, tipo, criado_em FROM utilizador WHERE id = $1 AND eliminado_em IS NULL`,
    [id]
  );
  if (result.rowCount === 0) {
    return NextResponse.json({ message: 'Utilizador não encontrado' }, { status: 404 });
  }
  return NextResponse.json({ data: result.rows[0] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userAuth = getAuthUser(request);
  if (!userAuth || userAuth.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    // Verificar existência
    const existing = await pool.query('SELECT * FROM utilizador WHERE id = $1 AND eliminado_em IS NULL', [id]);
    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'Utilizador não encontrado' }, { status: 404 });
    }

    // Atualizar campos de utilizador
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.nome) { updates.push(`nome = $${paramIndex}`); values.push(data.nome); paramIndex++; }
    if (data.bilhete) {
      // Verificar se o bilhete já existe em outro utilizador
      const bilheteExists = await pool.query(
        'SELECT 1 FROM utilizador WHERE bilhete = $1 AND id != $2 AND eliminado_em IS NULL',
        [data.bilhete, id]
      );
      if ((bilheteExists.rowCount ?? 0) > 0) {
        return NextResponse.json({ message: 'Bilhete já em uso' }, { status: 409 });
      }
      updates.push(`bilhete = $${paramIndex}`); values.push(data.bilhete); paramIndex++;
    }
    if (data.email !== undefined) { updates.push(`email = $${paramIndex}`); values.push(data.email); paramIndex++; }
    if (data.senha) {
      const hash = await hashPassword(data.senha);
      updates.push(`senha_hash = $${paramIndex}`); values.push(hash); paramIndex++;
    }
    if (data.tipo) { updates.push(`tipo = $${paramIndex}`); values.push(data.tipo); paramIndex++; }

    if (updates.length > 0) {
      updates.push(`atualizado_em = CURRENT_TIMESTAMP`);
      values.push(id);
      const query = `UPDATE utilizador SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      await pool.query(query, values);
    }

    // Atualizar/inserir dados específicos
    if (data.tipo === 'estudante' || existing.rows[0].tipo === 'estudante') {
      const estExists = await pool.query('SELECT 1 FROM estudante WHERE id_utilizador = $1', [id]);
      if (estExists.rowCount === 0 && data.tipo === 'estudante') {
        await pool.query(
          `INSERT INTO estudante (id_utilizador, numero_estudante, curso, ano_ingresso) VALUES ($1, $2, $3, $4)`,
          [id, data.numero_estudante || '', data.curso || '', data.ano_ingresso || new Date().getFullYear()]
        );
      } else if (estExists.rowCount! > 0 && data.tipo !== 'estudante') {
        await pool.query(`DELETE FROM estudante WHERE id_utilizador = $1`, [id]);
      } else if (data.numero_estudante || data.curso || data.ano_ingresso) {
        const estUpdates: string[] = [];
        const estValues: any[] = [];
        let estIdx = 1;
        if (data.numero_estudante) { estUpdates.push(`numero_estudante = $${estIdx}`); estValues.push(data.numero_estudante); estIdx++; }
        if (data.curso) { estUpdates.push(`curso = $${estIdx}`); estValues.push(data.curso); estIdx++; }
        if (data.ano_ingresso) { estUpdates.push(`ano_ingresso = $${estIdx}`); estValues.push(data.ano_ingresso); estIdx++; }
        if (estUpdates.length > 0) {
          estValues.push(id);
          await pool.query(`UPDATE estudante SET ${estUpdates.join(', ')} WHERE id_utilizador = $${estIdx}`, estValues);
        }
      }
    }

    if (data.tipo === 'docente' || existing.rows[0].tipo === 'docente') {
      const docExists = await pool.query('SELECT 1 FROM docente WHERE id_utilizador = $1', [id]);
      if (docExists.rowCount === 0 && data.tipo === 'docente') {
        await pool.query(
          `INSERT INTO docente (id_utilizador, departamento, titulacao, area_especializacao) VALUES ($1, $2, $3, $4)`,
          [id, data.departamento || '', data.titulacao || '', data.area_especializacao || null]
        );
      } else if (docExists.rowCount! > 0 && data.tipo !== 'docente') {
        await pool.query(`DELETE FROM docente WHERE id_utilizador = $1`, [id]);
      } else if (data.departamento || data.titulacao || data.area_especializacao !== undefined) {
        const docUpdates: string[] = [];
        const docValues: any[] = [];
        let docIdx = 1;
        if (data.departamento) { docUpdates.push(`departamento = $${docIdx}`); docValues.push(data.departamento); docIdx++; }
        if (data.titulacao) { docUpdates.push(`titulacao = $${docIdx}`); docValues.push(data.titulacao); docIdx++; }
        if (data.area_especializacao !== undefined) { docUpdates.push(`area_especializacao = $${docIdx}`); docValues.push(data.area_especializacao); docIdx++; }
        if (docUpdates.length > 0) {
          docValues.push(id);
          await pool.query(`UPDATE docente SET ${docUpdates.join(', ')} WHERE id_utilizador = $${docIdx}`, docValues);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Utilizador atualizado' });
  } catch (error: any) {
    console.error('Erro ao atualizar utilizador:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userAuth = getAuthUser(request);
  if (!userAuth || userAuth.tipo !== 'admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  await pool.query('UPDATE utilizador SET eliminado_em = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  return NextResponse.json({ success: true, message: 'Utilizador removido' });
}