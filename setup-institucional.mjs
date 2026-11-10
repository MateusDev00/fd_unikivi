import fs from 'fs';
import path from 'path';
import pg from 'pg';

// ==========================================
// FUNÇÃO PARA LER O .env MANUALMENTE (Sem dotenv)
// ==========================================
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          // Remove aspas se existirem
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value.trim();
        }
      });
      break; // Para no primeiro ficheiro que encontrar
    }
  }
}

loadEnv(); // Carrega as variáveis

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Utilitário para criar pastas e ficheiros
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Ficheiro criado: ${filePath}`);
}

async function run() {
  console.log('🚀 A iniciar configuração institucional...\n');

  // ==========================================
  // 1. ATUALIZAR BASE DE DADOS (SQL)
  // ==========================================
  console.log('📦 A atualizar a base de dados...');
  try {
    // Apagar duplicados de estudantes (mantém o primeiro ID)
    await pool.query(`
      DELETE FROM estudante_disciplina a USING estudante_disciplina b
      WHERE a.id > b.id AND a.id_estudante = b.id_estudante AND a.id_turma = b.id_turma AND a.id_disciplina = b.id_disciplina;
    `);

    // Criar restrição única para estudantes
    await pool.query(`
      ALTER TABLE estudante_disciplina 
      ADD CONSTRAINT unique_estudante_turma_disciplina UNIQUE (id_estudante, id_turma, id_disciplina);
    `).catch(e => console.log('   (Restrição de estudante já existe)'));

    // Apagar duplicados de docentes
    await pool.query(`
      DELETE FROM docente_disciplina a USING docente_disciplina b
      WHERE a.id > b.id AND a.id_docente = b.id_docente AND a.id_turma = b.id_turma AND a.id_disciplina = b.id_disciplina;
    `);

    // Criar restrição única para docentes
    await pool.query(`
      ALTER TABLE docente_disciplina 
      ADD CONSTRAINT unique_docente_turma_disciplina UNIQUE (id_docente, id_turma, id_disciplina);
    `).catch(e => console.log('   (Restrição de docente já existe)'));

    console.log('✅ Base de dados atualizada com sucesso.\n');
  } catch (err) {
    console.error('❌ Erro no SQL:', err.message);
  }

  // ==========================================
  // 2. CRIAR/ATUALIZAR ROTAS DE ASSOCIAÇÃO
  // ==========================================
  console.log('🔗 A configurar rotas de associação...');

  const estudanteRoute = `import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  try {
    const result = await pool.query(\`
      SELECT ed.id, ed.id_estudante, u.nome AS nome_estudante,
             ed.id_disciplina, d.nome AS nome_disciplina,
             ed.id_turma, t.nome AS nome_turma,
             ed.ano_frequencia, ed.semestre, ed.estado
      FROM estudante_disciplina ed
      LEFT JOIN utilizador u ON u.id = ed.id_estudante
      LEFT JOIN disciplina d ON d.id = ed.id_disciplina
      LEFT JOIN turma t ON t.id = ed.id_turma
      WHERE ed.eliminado_em IS NULL
      ORDER BY u.nome ASC
    \`);
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id_estudante, id_disciplina, id_turma, ano_frequencia, semestre } = await request.json();

  try {
    const result = await pool.query(
      \`INSERT INTO estudante_disciplina (id_estudante, id_disciplina, id_turma, ano_frequencia, semestre, estado)
       VALUES ($1, $2, $3, $4, $5, 'inscrito') RETURNING *\`,
      [id_estudante, id_disciplina, id_turma, ano_frequencia, semestre]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Este estudante já está associado a esta turma e disciplina.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}`;
  writeFile('src/app/api/associacoes/estudantes/route.ts', estudanteRoute);

  const docenteRoute = `import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  try {
    const result = await pool.query(\`
      SELECT dd.id, dd.id_docente, u.nome AS nome_docente,
             dd.id_disciplina, d.nome AS nome_disciplina,
             dd.id_turma, t.nome AS nome_turma,
             dd.cargo, dd.nivel_academico
      FROM docente_disciplina dd
      LEFT JOIN utilizador u ON u.id = dd.id_docente
      LEFT JOIN disciplina d ON d.id = dd.id_disciplina
      LEFT JOIN turma t ON t.id = dd.id_turma
      WHERE dd.eliminado_em IS NULL
      ORDER BY u.nome ASC
    \`);
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });

  const { id_docente, id_disciplina, id_turma, cargo, nivel_academico } = await request.json();

  try {
    const result = await pool.query(
      \`INSERT INTO docente_disciplina (id_docente, id_disciplina, id_turma, cargo, nivel_academico)
       VALUES ($1, $2, $3, $4, $5) RETURNING *\`,
      [id_docente, id_disciplina, id_turma, cargo, nivel_academico]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Este docente já está associado a esta turma e disciplina.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}`;
  writeFile('src/app/api/associacoes/docentes/route.ts', docenteRoute);

  // ==========================================
  // 3. CRIAR ROTAS DE RELATÓRIOS (EVENTOS E UTILIZADORES)
  // ==========================================
  console.log('📊 A configurar rotas de relatórios...');

  const eventosCsv = `import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) return new Response('Acesso negado', { status: 403 });

  const { searchParams } = new URL(request.url);
  let where = 'WHERE eliminado_em IS NULL';
  const params: any[] = [];

  if (searchParams.get('estado')) { where += \` AND estado = $\${params.length + 1}\`; params.push(searchParams.get('estado')); }
  if (searchParams.get('search')) { where += \` AND titulo ILIKE $\${params.length + 1}\`; params.push(\`%\${searchParams.get('search')}%\`); }

  const result = await pool.query(\`SELECT id, titulo, local, estado, data_evento FROM evento \${where} ORDER BY data_evento DESC\`, params);

  const csv = toCSV(result.rows, { id: 'ID', titulo: 'Título', local: 'Local', estado: 'Estado', data_evento: 'Data' });

  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="eventos.csv"' } });
}`;
  writeFile('src/app/api/relatorios/eventos/route.ts', eventosCsv);

  const eventosPdf = `import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'docente')) return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(\`SELECT id, titulo, local, estado, data_evento FROM evento WHERE eliminado_em IS NULL ORDER BY data_evento DESC\`);

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
}`;
  writeFile('src/app/api/relatorios/eventos/pdf/route.ts', eventosPdf);

  const utilCsv = `import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toCSV } from '@/lib/csv';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(\`SELECT id, nome, bilhete, email, tipo, criado_em FROM utilizador WHERE eliminado_em IS NULL ORDER BY nome ASC\`);

  const csv = toCSV(result.rows, { id: 'ID', nome: 'Nome', bilhete: 'Bilhete', email: 'Email', tipo: 'Perfil', criado_em: 'Registo' });

  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="utilizadores.csv"' } });
}`;
  writeFile('src/app/api/relatorios/utilizadores/route.ts', utilCsv);

  const utilPdf = `import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.tipo !== 'admin') return new Response('Acesso negado', { status: 403 });

  const result = await pool.query(\`SELECT id, nome, bilhete, tipo FROM utilizador WHERE eliminado_em IS NULL ORDER BY nome ASC\`);

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
}`;
  writeFile('src/app/api/relatorios/utilizadores/pdf/route.ts', utilPdf);

  console.log('\n🎉 TUDO PRONTO! O sistema foi atualizado com sucesso.');
  console.log('👉 Reinicia o servidor (npm run dev) para aplicar as alterações.');
  await pool.end();
}

run().catch(err => {
  console.error('❌ Erro crítico:', err);
  process.exit(1);
});