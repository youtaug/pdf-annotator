import { useState } from 'react';
import DropZone from './components/DropZone';
import Viewer from './components/Viewer';
import { AnnotatorFile, PageData } from './types/models';
import { usePersistedState } from './hooks/usePersistedState';

export default function App() {
  const [fileBuf, setFileBuf] = useState<ArrayBuffer | null>(null);
  const [data, setData] = useState<AnnotatorFile | null>(null);
  const [customStamps, setCustomStamps] = usePersistedState<string[]>(
    'custom-stamps',
    []
  );

  return (
    <div className="app">
      <h1>PDF Annotator</h1>

      <DropZone
        onLoad={(d, originalBuf) => {
          if (d.customStamps.length === 0) {
            d.customStamps = customStamps;
          } else {
            setCustomStamps(d.customStamps);
          }
          setData(d);
          setFileBuf(originalBuf);
        }}
      />

      {data && (
        <Viewer
          fileBuf={fileBuf!}
          data={data}
          onDataChange={(upd) => {
            setData({ ...upd });
            setCustomStamps(upd.customStamps);
          }}
        />
      )}
    </div>
  );
}

