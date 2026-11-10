import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.resolve(process.cwd(), 'src');
console.log('🚀 A procurar imports nomeados incorretos...\n');

let fixedCount = 0;

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Corrigir EventCard
    content = content.replace(
      /import\s*\{\s*EventCard\s*\}\s*from\s*['"]@\/components\/home\/EventCard['"];?/g,
      "import EventCard from '@/components/home/EventCard';"
    );

    // Corrigir PublicationCard
    content = content.replace(
      /import\s*\{\s*PublicationCard\s*\}\s*from\s*['"]@\/components\/home\/PublicationCard['"];?/g,
      "import PublicationCard from '@/components/home/PublicationCard';"
    );

    // Corrigir DocumentCard
    content = content.replace(
      /import\s*\{\s*DocumentCard\s*\}\s*from\s*['"]@\/components\/home\/DocumentCard['"];?/g,
      "import DocumentCard from '@/components/home/DocumentCard';"
    );

    // Suporte para caminhos relativos (ex: ../home/EventCard)
    content = content.replace(
      /import\s*\{\s*EventCard\s*\}\s*from\s*['"](\.\.?\/.*?home\/EventCard)['"];?/g,
      "import EventCard from '$1';"
    );
    content = content.replace(
      /import\s*\{\s*PublicationCard\s*\}\s*from\s*['"](\.\.?\/.*?home\/PublicationCard)['"];?/g,
      "import PublicationCard from '$1';"
    );
    content = content.replace(
      /import\s*\{\s*DocumentCard\s*\}\s*from\s*['"](\.\.?\/.*?home\/DocumentCard)['"];?/g,
      "import DocumentCard from '$1';"
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigido: ${path.relative(process.cwd(), filePath)}`);
      fixedCount++;
    }
  }
});

console.log(`\n🎉 Concluído! ${fixedCount} ficheiro(s) corrigido(s).`);