import { useState } from 'react';
import DropZone from './components/DropZone';
import Viewer from './components/Viewer';
import { AnnotatorFile } from './types/models';
import { exportJson, exportPdf } from './utils/exportHelpers';

export default function App() {
  const [fileBuf, setFileBuf] = useState<ArrayBuffer | null>(null);
  const [data, setData] = useState<AnnotatorFile | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  return (
    <div className="app">
      <h1>PDF Annotator</h1>

      <DropZone
        onLoad={(d, originalBuf) => {
          setData(d);
          setFileBuf(originalBuf);
          setProgress(null);
        }}
        onProgress={(p) => {
          if (p.type === 'progress') {
            setProgress(`読み込み ${p.done}/${p.total}`);
          } else if (p.type === 'ocr-progress') {
            const perc = (p.m?.progress ?? 0) * 100;
            setProgress(`OCR ${perc.toFixed(0)}%`);
          }
        }}
      />

      {progress && <p>{progress}</p>}

      {data && (
        <Viewer
          fileBuf={fileBuf!}
          data={data}
          onDataChange={(upd) => setData({ ...upd })}
        />
      )}

      {data && (
        <div style={{ marginTop: 10 }}>
          <button onClick={() => exportPdf(fileBuf!, data)}>PDF 書き出し</button>{' '}
          <button onClick={() => exportJson(data)}>JSON 保存</button>
        </div>
      )}
    </div>
  );
}

