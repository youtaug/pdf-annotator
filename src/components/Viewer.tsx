import { VariableSizeList as List } from 'react-window';
import { useState } from 'react';
import StampMenu from './StampMenu';
import { AnnotatorFile } from '../types/models';
import { renderPageToCanvas } from '../hooks/usePdfDisplay';

interface Props {
  fileBuf: ArrayBuffer;
  data: AnnotatorFile;
  onDataChange(d: AnnotatorFile): void;
}

export default function Viewer({ fileBuf, data, onDataChange }: Props) {
  const [selected, setSelected] = useState<{
    p: number;
    w: number;
  } | null>(null);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const page = data.pages[index];
    return (
      <div style={{ ...style, position: 'relative' }}>
        <canvas
          ref={(c) => c && renderPageToCanvas(fileBuf, page.number, c)}
        />
        {page.words.map((w, wi) => (
          <div
            key={w.id}
            className="word-box"
            style={{
              left: w.bbox[0],
              top: w.bbox[1],
              width: w.bbox[2],
              height: w.bbox[3]
            }}
            onClick={() => setSelected({ p: index, w: wi })}
          >
            {w.stamps.length > 0 && (
              <span className="word-stamp">{w.stamps.join(',')}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getItemSize = (i: number) => data.pages[i].height + 20;

  return (
    <div className="viewer">
      <List
        height={window.innerHeight - 200}
        itemCount={data.pages.length}
        itemSize={getItemSize}
        width={data.pages[0]?.width ?? 600}
      >
        {Row}
      </List>

      {selected && (
        <StampMenu
          word={data.pages[selected.p].words[selected.w]}
          customStamps={data.customStamps}
          onClose={() => setSelected(null)}
          onUpdate={(stamps, newCustom) => {
            const updated = { ...data };
            updated.pages[selected.p].words[selected.w].stamps = stamps;
            updated.customStamps = newCustom;
            onDataChange(updated);
          }}
        />
      )}
    </div>
  );
}

