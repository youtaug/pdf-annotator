/* eslint-disable no-restricted-globals */
import { getDocument, GlobalWorkerOptions, TextItem } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { uuid } from '../utils/uuid';
import { PageData, Word } from '../types/models';

// pdf.js worker (内部でさらにpdfjs-dist/workerが必要)
GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

const tWorkerPromise = createWorker('eng', 1, {
  logger: (m) => postMessage({ type: 'ocr-progress', m })
});

self.onmessage = async (ev) => {
  const buf: ArrayBuffer = ev.data;
  try {
    const pdf = await getDocument({ data: buf }).promise;
    const pages: PageData[] = [];

    const tWorker = await tWorkerPromise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      let words: Word[] = [];
      const textCont = await page.getTextContent();
      if (textCont.items.length > 0) {
        words = textContentToWords(textCont.items as TextItem[]);
      } else {
        // OCR fallback
        const canvas = new OffscreenCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const { data: ocr } = await tWorker.recognize(canvas);
        words = ocr.words.map<Word>((w) => ({
          id: uuid(),
          text: w.text,
          bbox: [w.bbox.x0, viewport.height - w.bbox.y1, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0],
          stamps: []
        }));
      }

      pages.push({
        number: i,
        width: viewport.width,
        height: viewport.height,
        words
      });

      postMessage({ type: 'progress', done: i, total: pdf.numPages });
    }

    await tWorker.terminate();
    postMessage({ type: 'done', pages });
  } catch (e) {
    postMessage({ type: 'error', message: (e as Error).message });
  }
};

function textContentToWords(items: TextItem[]): Word[] {
  const words: Word[] = [];
  items.forEach((it) => {
    const strWords = it.str.split(/\s+/).filter((s) => s.length > 0);
    const [x, y, , , a, b] = it.transform; // pdf.js transform
    const fontHeight = Math.abs(b);
    let offsetX = 0;
    strWords.forEach((w) => {
      const width = (w.length / it.str.length) * it.width;
      words.push({
        id: uuid(),
        text: w,
        bbox: [x + offsetX, y - fontHeight, width, fontHeight],
        stamps: []
      });
      offsetX += width + 2; // 2px ギャップ仮定
    });
  });
  return words;
}

