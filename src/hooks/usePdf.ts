import { AnnotatorFile } from '../types/models';
import { toAnnotatorFile } from '../utils/fileHelpers';

export async function importPdf(file: File): Promise<{ buf: ArrayBuffer; data: AnnotatorFile }> {
  const buf = await file.arrayBuffer();
  const worker = new Worker(new URL('../workers/pdfWorker.ts', import.meta.url), { type: 'module' });

  return new Promise((resolve, reject) => {
    worker.onerror = (e) => reject(e);

    worker.onmessage = (ev) => {
      const { type, pages } = ev.data;
      if (type === 'done') {
        worker.terminate();
        resolve({ buf, data: toAnnotatorFile(pages) });
      }
    };

    worker.postMessage(buf, [buf]); // Transfer ArrayBuffer
  });
}

