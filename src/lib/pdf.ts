import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generatePDF({
  title,
  filtersInfo,
  data,
  columns,
}: {
  title: string;
  filtersInfo: string;
  data: any[];
  columns: { key: string; label: string; width: number; align?: 'left' | 'center' | 'right' }[];
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Configuração A4 Paisagem (Landscape)
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 40;

    // ===== 1. CABEÇALHO INSTITUCIONAL =====
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    
    // Desenha a barra lateral (verde escuro institucional)
    doc.rect(0, 0, 15, pageHeight).fill('#0a2b1d');

    // Adiciona o Logotipo (se existir)
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, margin, 30, { width: 50 });
    }

    // Textos do Cabeçalho
    doc
      .fillColor('#0a2b1d')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('FACULDADE DE DIREITO', margin + 60, 35);

    doc
      .fillColor('#6b7280')
      .fontSize(12)
      .font('Helvetica')
      .text('Universidade Kimpa Vita', margin + 60, 55);

    // Título do Relatório (Alinhado à direita)
    doc
      .fillColor('#0a2b1d')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(title.toUpperCase(), margin, 35, { align: 'right', width: pageWidth - margin * 2 });

    // Data de Geração e Filtros (Alinhado à direita)
    doc
      .fillColor('#6b7280')
      .fontSize(9)
      .font('Helvetica-Oblique')
      .text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, margin, 55, { align: 'right', width: pageWidth - margin * 2 });

    doc
      .fillColor('#8c0034') // Vinho para os filtros
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(`Filtros: ${filtersInfo || 'Nenhum'}`, margin, 70, { align: 'right', width: pageWidth - margin * 2 });

    // Linha separadora do cabeçalho
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(margin, 95)
      .lineTo(pageWidth - margin, 95)
      .stroke();

    // ===== 2. CONSTRUÇÃO DA TABELA =====
    const tableTop = 115;
    const rowHeight = 25;
    let currentY = tableTop;

    // Cabeçalho da Tabela (Fundo cinza claro)
    doc.rect(margin, currentY, pageWidth - margin * 2, rowHeight).fill('#f3f4f6');

    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold');
    let currentX = margin + 10;

    columns.forEach((col) => {
      doc.text(col.label.toUpperCase(), currentX, currentY + 8, {
        width: col.width - 20,
        align: col.align || 'left',
      });
      currentX += col.width;
    });

    currentY += rowHeight;

    // Linhas da Tabela
    doc.font('Helvetica').fontSize(9).fillColor('#374151');

    data.forEach((row, index) => {
      // Quebra de página
      if (currentY + rowHeight > pageHeight - 60) {
        doc.addPage();
        currentY = 40; // Reinicia no topo da nova página
        // Redesenha o cabeçalho da tabela na nova página
        doc.rect(margin, currentY, pageWidth - margin * 2, rowHeight).fill('#f3f4f6');
        doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold');
        let newX = margin + 10;
        columns.forEach((col) => {
          doc.text(col.label.toUpperCase(), newX, currentY + 8, { width: col.width - 20, align: col.align || 'left' });
          newX += col.width;
        });
        currentY += rowHeight;
        doc.font('Helvetica').fontSize(9).fillColor('#374151');
      }

      // Fundo zebrado (cinza muito claro nas linhas pares)
      if (index % 2 === 0) {
        doc.rect(margin, currentY, pageWidth - margin * 2, rowHeight).fill('#f9fafb');
      }

      // Linha inferior de cada célula
      doc
        .strokeColor('#e5e7eb')
        .lineWidth(0.5)
        .moveTo(margin, currentY + rowHeight)
        .lineTo(pageWidth - margin, currentY + rowHeight)
        .stroke();

      currentX = margin + 10;
      doc.fillColor('#111827'); // Texto escuro para leitura

      columns.forEach((col) => {
        let value = row[col.key] ?? '—';
        
        // Formatação de Data
        if (col.key.includes('data') || col.key.includes('criado_em') || col.key.includes('evento')) {
          if (value !== '—' && value) {
            value = new Date(value).toLocaleString('pt-AO', { dateStyle: 'short', timeStyle: 'short' });
          }
        }

        doc.text(String(value), currentX, currentY + 8, {
          width: col.width - 20,
          align: col.align || 'left',
          lineBreak: false,
          ellipsis: true, // Corta o texto se for muito grande
        });
        currentX += col.width;
      });

      currentY += rowHeight;
    });

    // ===== 3. RODAPÉ =====
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      
      // Linha do rodapé
      doc
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .moveTo(margin, pageHeight - 40)
        .lineTo(pageWidth - margin, pageHeight - 40)
        .stroke();

      doc
        .fontSize(8)
        .fillColor('#9ca3af')
        .font('Helvetica')
        .text(
          'Documento gerado automaticamente pelo Sistema de Gestão da FD-UNIKIVI.',
          margin,
          pageHeight - 30,
          { align: 'left' }
        );

      doc.text(
        `Página ${i + 1} de ${range.count}`,
        margin,
        pageHeight - 30,
        { align: 'right', width: pageWidth - margin * 2 }
      );
    }

    doc.end();
  });
}