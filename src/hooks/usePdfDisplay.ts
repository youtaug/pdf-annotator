import { getDocument, GlobalWorkerOptions, PDFPageProxy } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

export async function renderPageToCanvas(
  buf: ArrayBuffer,
  pageNum: number,
  canvas: HTMLCanvasElement
) {
  const pdf = await getDocument({ data: buf }).promise;
  const page = await pdf.getPage(pageNum);
  await internalRender(page, canvas);
}

async function internalRender(page: PDFPageProxy, canvas: HTMLCanvasElement) {
  const viewport = page.getViewport({ scale: 1 });
  const ctx = canvas.getContext('2d')!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;
}

