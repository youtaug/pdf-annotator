# pdf-annotator


# PDF Annotator

単語ごとに文法スタンプを付けられる簡易 PDF 注釈アプリ。  
VS Code + Node.js LTS + Chrome 最新版で動作確認。

```bash
# 初回セットアップ
npm install

# 開発サーバ
npm run dev
# -> http://localhost:5173 を Chrome で開く

# 本番ビルド
npm run build

# ビルド内容をローカルプレビュー
npm run preview

---

## カスタムスタンプの追加

`src/components/StampMenu.tsx` から追加したスタンプは `localStorage` に保存され、次回以降のファイル読み込み時にも利用できます。任意のスタンプを入力して `追加` ボタンを押してください。

---

## 2. `public` ディレクトリ

### `public/manifest.webmanifest`
```json
{
  "name": "PDF Annotator",
  "short_name": "Annotator",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
