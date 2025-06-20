import { AnnotatorFile } from '../types/models';
import { toAnnotatorFile } from '../utils/fileHelpers';

export interface ImportProgress {
  type: 'progress' | 'ocr-progress';
  done?: number;
  total?: number;
  m?: unknown;
}

export async function importPdf(
  file: File,
  onProgress?: (p: ImportProgress) => void
): Promise<{ buf: ArrayBuffer; data: AnnotatorFile }> {
  const buf = await file.arrayBuffer();
  const worker = new Worker(new URL('../workers/pdfWorker.ts', import.meta.url), { type: 'module' });

  return new Promise((resolve, reject) => {
    worker.onerror = (e) => reject(e);

    worker.onmessage = (ev) => {
      const { type } = ev.data;
      if (type === 'done') {
        worker.terminate();
        resolve({ buf, data: toAnnotatorFile(ev.data.pages) });
      } else if (type === 'progress' || type === 'ocr-progress') {
        onProgress?.(ev.data);
      } else if (type === 'error') {
        worker.terminate();
        reject(new Error(ev.data.message));
      }
    };

    worker.postMessage(buf, [buf]); // Transfer ArrayBuffer
  });
}

