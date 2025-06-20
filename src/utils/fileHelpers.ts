import { AnnotatorFile, PageData } from '../types/models';

export function isJsonFile(f: File) {
  return f.name.toLowerCase().endsWith('.json');
}

export async function readJson(f: File): Promise<AnnotatorFile> {
  const txt = await f.text();
  return JSON.parse(txt);
}

export function toAnnotatorFile(
  pages: PageData[],
  customStamps: string[] = []
): AnnotatorFile {
  return {
    app: 'pdf-annotator',
    version: 1,
    created: new Date().toISOString(),
    pages,
    customStamps
  };
}

