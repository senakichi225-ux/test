# docs/templates — 作品管理のひな形

| ファイル | 使い方 |
|---|---|
| `certificate.md` | 作品証明書のひな形（日本語・英語）。作品ごとに埋めて印刷する |
| `works_registry.csv` | 作品台帳。**すべての作品（試作も）を1行ずつ記録する**。表計算ソフトで開ける |

## 作品台帳の列
- `work_no`：作品番号（`WADO-2026-ICHI-U001` など。`docs/products/first_collection.md` §5）
- `type`：`unique`（一点物）／`edition`（限定）／`prototype`（試作・非売品）
- `edition`：限定作品の番号（例：`3/30`）。一点物は空欄
- `status`：`making`（制作中）／`ready`（販売可能）／`reserved`（商談中）／`sold`（販売済み）／`kept`（手元に保管）
- `cost_jpy`：実際の原価（円）。`price_jpy`：販売価格（円）
- `channel`：`direct`（直販）／`gallery`（ギャラリー）／`other`
- 売上・顧客の情報（名前・住所など）は**この台帳に書かない**（個人情報は別に、保護者が管理する）
