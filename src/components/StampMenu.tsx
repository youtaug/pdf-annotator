import { useState } from 'react';
import { Word } from '../types/models';

interface Props {
  word: Word;
  customStamps: string[];
  onClose(): void;
  onUpdate(stamps: string[], customStamps: string[]): void;
}

export default function StampMenu({ word, customStamps, onClose, onUpdate }: Props) {
  const presets = ['S', 'V', 'O', 'C', 'M', ...customStamps];
  const [newStamp, setNewStamp] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', padding: 20, minWidth: 240 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>スタンプ選択</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {presets.map((s) => (
            <button
              key={s}
              style={{ padding: '2px 6px' }}
              onClick={() => onUpdate([...word.stamps, s], customStamps)}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 8 }}>
          <input
            placeholder="カスタム追加"
            value={newStamp}
            onChange={(e) => setNewStamp(e.target.value)}
          />
          <button
            disabled={!newStamp.trim()}
            onClick={() => {
              const val = newStamp.trim();
              if (!val || presets.includes(val)) return;
              const upd = [...customStamps, val];
              onUpdate([...word.stamps, val], upd);
              setNewStamp('');
            }}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}

