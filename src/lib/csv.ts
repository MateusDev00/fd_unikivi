export function toCSV(data: Record<string, any>[], headers: Record<string, string>): string {
  const keys = Object.keys(headers);
  const headerRow = Object.values(headers).map(h => `"${h}"`).join(';');

  const rows = data.map(row =>
    keys.map(key => {
      let val = row[key] ?? '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(';')
  );

  // BOM para o Excel reconhecer acentos em UTF-8
  return '\uFEFF' + [headerRow, ...rows].join('\r\n');
}