import { useState } from 'react';
import DropZone from './components/DropZone';
import Viewer from './components/Viewer';
import { AnnotatorFile, PageData } from './types/models';

export default function App() {
  const [fileBuf, setFileBuf] = useState<ArrayBuffer | null>(null);
  const [data, setData] = useState<AnnotatorFile | null>(null);

  return (
    <div className="app">
      <h1>PDF Annotator</h1>

      <DropZone
        onLoad={(d, originalBuf) => {
          setData(d);
          setFileBuf(originalBuf);
        }}
      />

      {data && (
        <Viewer
          fileBuf={fileBuf!}
          data={data}
          onDataChange={(upd) => setData({ ...upd })}
        />
      )}
    </div>
  );
}

