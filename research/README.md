# research/ — SŌN のリサーチデータ

`docs/research_plan.md` の観点ごとに、仮説と根拠を JSON で記録します。
リサーチ管理画面（`web` の `/en/research`・`/ja/research`）がこのフォルダを読みます。

| ファイル | 観点 |
|---|---|
| `trends.json` | 1. 海外ニーズ |
| `specs.json` | 2-1. 製品規格 |
| `logistics.json` | 2-2. 梱包・国際配送 |
| `competitors.json` | 3. 競合・先進事例 |
| `suppliers.json` | 4. サプライチェーン |
| `stories.json` | 5. ストーリーテリング |

## ルール
- 形は `web/src/lib/research/schema.ts` で決まっています（`cd web && npm test` で全ファイルを検証）。
- `status` は `hypothesis`（仮説）→ `investigating`（調査中）→ `verified`（確認済み）／`rejected`（否定）。
- **`verified` にできるのは、`evidence` に一次情報（`"primary": true`）が1つ以上あるときだけ。**
- AI社員の調査（`報告/` など）から転記するときは、`note` に転記元のファイル名を書き、検索結果だけで確かめたものは `"primary": false` にする。
