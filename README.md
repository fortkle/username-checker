# Username Checker

複数のソーシャルメディアプラットフォームやドメインにおいて、指定されたユーザー名/ドメインプレフィックスが利用可能かを確認できるWebサービスです。

## 機能

- ユーザー名の入力と一括チェック
- 複数のプラットフォームでの利用可否をリアルタイム表示
- レスポンシブなUI

## 技術スタック

- **共通:** TypeScript, Node.js, pnpm workspace, Turborepo, Biome, Vitest
- **バックエンド:** Hono, Zod, Pino
- **フロントエンド:** React, Vite, TailwindCSS, TanStack Query, Radix UI, React Hook Form

## 開発環境のセットアップ

### 必要条件

- Node.js v20以上
- pnpm v8以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/fortkle/username-checker.git
cd username-checker

# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
# 全パッケージの開発サーバーを起動
pnpm dev
```

### テスト実行

```bash
# 全パッケージのテストを実行
pnpm test
```

### リンターとフォーマッター

```bash
# リンター実行
pnpm lint

# フォーマッター実行
pnpm format
```

## プロジェクト構成

```
username-checker/
├── configs/           # 共通設定ファイル
├── packages/
│   ├── server-app/    # バックエンドAPI (Hono)
│   └── web-app/       # フロントエンドUI (React)
├── biome.json         # Biome設定
├── turbo.json         # Turborepo設定
└── pnpm-workspace.yaml # pnpmワークスペース設定
```

## ライセンス

MIT 