import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/app/api/associacoes/docentes/route.ts',
  'src/app/api/associacoes/estudantes/route.ts',
  'src/app/api/associacoes/docentes/[id]/route.ts',
  'src/app/api/associacoes/estudantes/[id]/route.ts',
  'src/app/api/relatorios/eventos/route.ts',
  'src/app/api/relatorios/utilizadores/route.ts'
];

console.log('🚀 A corrigir tipagem do TypeScript (catch error)...\n');

filesToFix.forEach((file) => {
  const filePath = path.resolve(process.cwd(), file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Substitui catch (error) por catch (error: any)
    content = content.replace(/catch\s*\(\s*error\s*\)/g, 'catch (error: any)');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigido: ${file}`);
    } else {
      console.log(`ℹ️  Já estava correto ou não foi encontrado o bloco catch: ${file}`);
    }
  } else {
    console.log(`⚠️  Ficheiro não encontrado (ignorado): ${file}`);
  }
});

console.log('\n🎉 Concluído! Podes fazer o commit e o push.');