import { isJsonFile, readJson } from '../utils/fileHelpers';
import { AnnotatorFile } from '../types/models';
import { importPdf, ImportProgress } from '../hooks/usePdf';

interface Props {
  onLoad: (data: AnnotatorFile, originalBuf: ArrayBuffer) => void;
  onProgress?: (p: ImportProgress) => void;
}

export default function DropZone({ onLoad, onProgress }: Props) {
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      let data: AnnotatorFile;
      let buf: ArrayBuffer;

      if (isJsonFile(file)) {
        data = await readJson(file);
        buf = new ArrayBuffer(0); // JSON の場合は空で
      } else {
        const res = await importPdf(file, onProgress);
        data = res.data;
        buf = res.buf;
      }
      onLoad(data, buf);
    } catch (e) {
      alert('読み込み失敗: ' + (e as Error).message);
      console.error(e);
    }
  };

  return (
    <label className="dropzone">
      ここに PDF または JSON をドロップ（クリックして選択も可）
      <input
        type="file"
        accept=".pdf,.json"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </label>
  );
}

