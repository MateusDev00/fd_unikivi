import fs from 'fs';
import path from 'path';

// ==========================================
// 1. GARANTIR EXPORT DEFAULT NOS FICHEIROS DOS CARDS
// ==========================================
const cardFiles = [
  'src/components/home/EventCard.tsx',
  'src/components/home/PublicationCard.tsx',
  'src/components/home/DocumentCard.tsx'
];

console.log('🛠️  A garantir "export default" nos ficheiros dos cards...\n');

cardFiles.forEach((file) => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Substitui "export function NomeCard" por "export default function NomeCard"
    content = content.replace(/export\s+function\s+(EventCard|PublicationCard|DocumentCard)/g, 'export default function $1');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Export default corrigido em: ${file}`);
    } else {
      console.log(`ℹ️  Já estava com export default: ${file}`);
    }
  } else {
    console.log(`⚠️  Ficheiro não encontrado: ${file}`);
  }
});

// ==========================================
// 2. VARRER TODO O PROJETO E CORRIGIR OS IMPORTS
// ==========================================
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.resolve(process.cwd(), 'src');
let fixedImports = 0;

console.log('\n🔍 A procurar imports com chavetas { EventCard | PublicationCard | DocumentCard }...\n');

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Regex global para apanhar qualquer caminho e remover as chavetas
    content = content.replace(
      /import\s*\{\s*(EventCard|PublicationCard|DocumentCard)\s*\}\s*from\s*(['"][^'"]*home\/(?:EventCard|PublicationCard|DocumentCard)['"]);?/g,
      'import $1 from $2;'
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Import corrigido: ${path.relative(process.cwd(), filePath)}`);
      fixedImports++;
    }
  }
});

console.log(`\n🎉 Concluído! ${fixedImports} ficheiro(s) com imports corrigidos.`);