/**
 * Minimal PDF writer used to seed demo books with something real to open.
 *
 * It produces a valid single-font, multi-page PDF (Helvetica) with one text
 * block per page. It is deliberately tiny: no compression, no images.
 */

function escapeText(text: string): string {
  // PDF string literals: escape backslash and parentheses, drop the rest to
  // printable ASCII so the WinAnsi default encoding always works.
  return text
    .replace(/[^\x20-\x7e]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function makeTextPdf(title: string, paragraphs: string[]): Blob {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 60;
  const lineHeight = 17;
  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

  // Wrap at ~88 characters — close to Helvetica 11pt across the text width.
  const wrap = (text: string): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      if ((line + ' ' + word).trim().length > 88) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const body = paragraphs.flatMap((p) => [...wrap(p), '']);
  const pages: string[][] = [];
  for (let i = 0; i < Math.max(1, Math.ceil(body.length / linesPerPage)); i += 1) {
    pages.push(body.slice(i * linesPerPage, (i + 1) * linesPerPage));
  }

  const objects: string[] = [];
  const pageIds = pages.map((_, index) => 3 + index * 2);

  const contentFor = (lines: string[], isFirst: boolean): string => {
    const out: string[] = ['BT'];
    let y = pageHeight - margin;
    if (isFirst) {
      out.push(`/F2 20 Tf`, `1 0 0 1 ${margin} ${y} Tm`, `(${escapeText(title)}) Tj`);
      y -= 34;
    }
    out.push('/F1 11 Tf', `1 0 0 1 ${margin} ${y} Tm`, `${lineHeight} TL`);
    for (const line of lines) out.push(`(${escapeText(line)}) Tj T*`);
    out.push('ET');
    return out.join('\n');
  };

  // 1: catalog, 2: pages, then per page: page object + content object,
  // followed by the two fonts.
  const fontRegular = 3 + pages.length * 2;
  const fontBold = fontRegular + 1;

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] =
    `<< /Type /Pages /Count ${pages.length} /Kids [` +
    pageIds.map((id) => `${id} 0 R`).join(' ') +
    '] >>';

  pages.forEach((lines, index) => {
    const pageId = pageIds[index];
    const contentId = pageId + 1;
    const content = contentFor(lines, index === 0);
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> ` +
      `/Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  objects[fontRegular] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[fontBold] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id += 1) {
    if (!objects[id]) continue;
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  const count = objects.length;
  pdf += `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let id = 1; id < count; id += 1) {
    const offset = offsets[id];
    pdf += offset !== undefined ? `${String(offset).padStart(10, '0')} 00000 n \n` : '0000000000 65535 f \n';
  }
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}
