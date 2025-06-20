export interface Word {
  id: string;
  text: string;
  bbox: [number, number, number, number]; // x,y,w,h @ scale 1
  stamps: string[];
}
export interface PageData {
  number: number;
  width: number;
  height: number;
  words: Word[];
}
export interface AnnotatorFile {
  app: 'pdf-annotator';
  version: 1;
  created: string;
  pages: PageData[];
  customStamps: string[];
}

