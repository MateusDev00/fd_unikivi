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
let fixedCount = 0;

console.log('🚀 A procurar e corrigir TODOS os imports dos Cards...\n');

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Regex global que apanha qualquer caminho (@/ ou relativo) e variações de espaços
    const eventCardRegex = /import\s*\{\s*EventCard\s*\}\s*from\s*(['"][^'"]*home\/EventCard['"]);?/g;
    const pubCardRegex = /import\s*\{\s*PublicationCard\s*\}\s*from\s*(['"][^'"]*home\/PublicationCard['"]);?/g;
    const docCardRegex = /import\s*\{\s*DocumentCard\s*\}\s*from\s*(['"][^'"]*home\/DocumentCard['"]);?/g;

    content = content.replace(eventCardRegex, 'import EventCard from $1;');
    content = content.replace(pubCardRegex, 'import PublicationCard from $1;');
    content = content.replace(docCardRegex, 'import DocumentCard from $1;');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigido: ${path.relative(process.cwd(), filePath)}`);
      fixedCount++;
    }
  }
});

console.log(`\n🎉 Concluído! ${fixedCount} ficheiro(s) corrigido(s).`);