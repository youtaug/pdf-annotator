import { AnnotatorFile } from '../types/models';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function exportJson(data: AnnotatorFile) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, 'annotated.json');
}

export async function exportPdf(original: ArrayBuffer, data: AnnotatorFile) {
  const pdfDoc = await PDFDocument.load(original);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  data.pages.forEach((p) => {
    const page = pdfDoc.getPage(p.number - 1);
    p.words.forEach((w) => {
      if (!w.stamps.length) return;
      page.drawText(w.stamps.join(','), {
        x: w.bbox[0],
        y: p.height - w.bbox[1],
        size: 8,
        font,
        color: rgb(1, 0, 0)
      });
    });
  });
  const bytes = await pdfDoc.save();
  triggerDownload(new Blob([bytes], { type: 'application/pdf' }), 'annotated.pdf');
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

