# Webサービス版 ユーザー名一括チェックツール開発計画

## 1. 目的

複数のソーシャルメディアプラットフォームやドメインにおいて、指定されたユーザー名/ドメインプレフィックスが利用可能かを確認できる **Webサービス** を作成する。`https://namechk.com/` や `https://instantusername.com/` のような機能を目指す。

## 2. 主要機能

*   **フロントエンド (Web UI):**
    *   ユーザーがチェックしたいユーザー名を入力できるフォーム。
    *   チェック対象プラットフォームの選択機能（将来的には）。
    *   チェック結果をリアルタイムに近い形でグリッド表示（プラットフォーム名、アイコン、ステータス: 利用可能/利用不可/チェック中/エラー）。
    *   レスポンシブデザイン。
*   **バックエンド (API):**
    *   フロントエンドからのリクエストを受け付け、指定されたユーザー名に対するチェック処理を実行するAPIエンドポイント (`/api/check/:username`)。
    *   各プラットフォームへの利用可否チェック（HTTP/DNS）を非同期で効率的に実行するロジック。
    *   チェック結果をJSON形式でフロントエンドに返す。

## 3. 技術スタック (tech-stack.mdc 準拠)

*   **共通:**
    *   言語: TypeScript
    *   ランタイム: Node.js (v20+)
    *   モノレポ管理: pnpm workspace, Turborepo
    *   コード品質: Biome
    *   テスト: Vitest
*   **バックエンド (`packages/server-app`):**
    *   フレームワーク: Hono
    *   スキーマ検証: Zod (APIリクエスト/レスポンス)
    *   ロギング: Pino
    *   HTTPクライアント: Node.js `fetch` (or `undici`)
    *   DNSルックアップ: Node.js `dns`
*   **フロントエンド (`packages/web-app`):**
    *   フレームワーク: React (v18+)
    *   ビルドツール: Vite
    *   スタイリング: TailwindCSS
    *   状態管理/データフェッチ: TanStack Query (React Query)
    *   コンポーネントライブラリ: Radix UI (一部利用検討)
    *   フォーム管理: React Hook Form, Zod (入力バリデーション)
*   **インフラストラクチャ:**
    *   コンテナ化: Docker
    *   デプロイ: Google Cloud Run (API), Firebase Hosting (Web)

## 4. 実装アプローチ

*   **Monorepo構成:** `@quick-start.mdc` に従い、`packages/server-app` (バックエンド) と `packages/web-app` (フロントエンド) を含むモノレポ構造とする。
*   **API設計:** RESTful なAPIエンドポイント (`/api/check/:username`) を設計。リクエストとレスポンスは `Zod` でスキーマを定義し検証する。
*   **バックエンド処理:**
    *   `server-app` (Hono) でAPIリクエストを受け取る。
    *   プラットフォーム定義（名前、チェックURL/方法など）に基づき、`Promise.allSettled` を用いて各プラットフォームへのチェック (HTTP/DNS) を並行実行。
    *   レート制限やエラーハンドリングを考慮。
    *   CORSミドルウェアを設定し、`web-app` からのリクエストを許可する。
*   **フロントエンド処理:**
    *   `web-app` (React) でユーザー入力を受け付ける (React Hook Form, Zod)。
    *   `TanStack Query` を使用してバックエンドAPI (`/api/check/:username`) を呼び出し、データフェッチと状態（ローディング、エラー、成功）を管理。
    *   取得した結果を整形し、グリッド形式で動的に表示 (TailwindCSS, Radix UI)。
*   **テスト:**
    *   バックエンド: APIハンドラー、チェックロジックのユニットテスト/統合テスト (`Vitest`, モック活用)。
    *   フロントエンド: コンポーネントテスト、API連携部分のテスト (`Vitest`, `@testing-library/react`, モック活用)。

## 5. 注意点と課題

*   **バックエンド:**
    *   Webスクレイピングの不安定性、各プラットフォームの利用規約。
    *   レート制限対策 (IPアドレスごとの制限、適切な待機時間)。Cloud Runのスケーリング設定も考慮。
    *   エラーハンドリング (ネットワークエラー、タイムアウト、予期せぬレスポンス、DNSエラー)。
    *   **CORS設定:** `web-app` のオリジンを許可する設定が必要。
*   **フロントエンド:**
    *   状態管理の複雑化 (多数のプラットフォームのチェック状態)。
    *   ユーザー体験 (リアルタイム性の担保、ローディング/エラーステータスの表示)。
    *   入力バリデーション。
*   **開発プロセス:**
    *   `.cursor/rules/development.mdc` の規約遵守 (コミットメッセージ、PRルール)。
    *   作業単位でのPR作成、随時のリンター/フォーマッター適用。

## 6. 開発ステップ（案） - Webサービス UI先行アプローチ

**フェーズ 1: 環境セットアップ (Webサービス向け)**

1.  **モノレポ基本設定:** `@quick-start.mdc` を参考に、モノレポ環境 (`pnpm`, `turbo`, `configs/*`, ルート `biome.json` 等) をセットアップ。
2.  **`server-app` セットアップ (最小限):** `@quick-start.mdc` を参考に `packages/server-app` を作成。基本のヘルスチェックAPIのみ実装。
3.  **`web-app` セットアップ:** `@quick-start.mdc` を参考に `packages/web-app` を作成。依存関係 (`react`, `tailwindcss`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@radix-ui/react-slot` 等) を追加。基本的な "Hello World" 表示とテストを作成。
4.  **リンター/フォーマッター適用:** `pnpm lint`, `pnpm format` を実行し、初期設定を確認。
5.  **(PR作成 1: 環境セットアップ)**

**フェーズ 2: フロントエンド UI (モック) 実装**

6.  **UIコンポーネント作成 (`web-app`):**
    *   ユーザー名入力フォーム (React Hook Form, Zod バリデーション)。
    *   結果表示用グリッドコンポーネント (TailwindCSS スタイリング)。
    *   各プラットフォーム表示用カードコンポーネント (アイコン、名前、ステータス表示)。
7.  **モックデータ/関数定義:** APIレスポンスを模倣したモックデータと、それを返すモック関数 (例: `setTimeout` で遅延をシミュレート) を定義 (`web-app/src/mocks/handlers.ts` など)。
8.  **状態管理/データフェッチ設定:** `TanStack Query` をセットアップ。
9.  **モックAPI連携:** フォーム送信時に `TanStack Query` を使って **モック関数** を呼び出す処理を実装 (`web-app/src/hooks/useCheckUsername.ts` など)。
10. **表示ロジック:** モックAPIからのレスポンス (ローディング/成功/エラー) に応じてグリッドの表示を更新するロジックを実装。
11. **テスト実装 (UI):** 主要なコンポーネント、フォーム、モックAPI連携フックのテスト (`Vitest`, `@testing-library/react`)。
12. **リンター/フォーマッター適用:** `pnpm lint --filter web-app`, `pnpm format --filter web-app`。
13. **(PR作成 2: フロントエンドUIモック実装)**

**フェーズ 3: バックエンド API 実装**

14. **APIエンドポイント定義:** `/api/check/:username` のHonoルートとリクエスト/レスポンスのZodスキーマを定義 (`server-app/src/handlers/check.ts` など)。
15. **チェックロジック実装:** プラットフォーム定義、HTTP/DNSチェッカー関数などを `server-app` に実装 (`server-app/src/services/checker.ts` など)。
16. **APIハンドラー実装:** エンドポイントでチェッカーサービスを呼び出し、結果を返す処理を実装。`Promise.allSettled` で並行処理。
17. **CORS設定:** HonoのCORSミドルウェアを設定し、`web-app` (例: `http://localhost:3000`) からのアクセスを許可。
18. **エラーハンドリング:** チェック中のエラーを捕捉し、適切なAPIレスポンスを返す処理を追加。
19. **テスト実装 (API):** APIハンドラー、チェッカーサービスのユニットテスト/統合テスト (`Vitest`)。
20. **リンター/フォーマッター適用:** `pnpm lint --filter server-app`, `pnpm format --filter server-app`。
21. **(PR作成 3: バックエンドAPI実装)**

**フェーズ 4: フロントエンドとバックエンドの結合**

22. **API連携修正 (`web-app`):** `web-app/src/hooks/useCheckUsername.ts` などで、モック関数呼び出しを実際のバックエンドAPI (`/api/check/:username`) 呼び出しに差し替える。
23. **Viteプロキシ設定:** `web-app/vite.config.ts` に、開発時に `/api` へのリクエストを `server-app` (例: `http://localhost:8787`) に転送するプロキシ設定を追加。
24. **E2E動作確認:** 開発サーバー (`pnpm dev`) を起動し、フロントエンドからユーザー名を入力してバックエンドAPIが呼ばれ、結果が正しく表示されるかを確認。
25. **結合テスト/微調整:** 必要に応じてフロントエンド・バックエンド間のデータの整合性確認テストや、エラーハンドリングの調整を行う。
26. **リンター/フォーマッター適用:** `pnpm lint`, `pnpm format`。
27. **(PR作成 4: フロントエンド・バックエンド結合)**

**フェーズ 5: 改善と仕上げ**

28. **UI/UX改善:** ローディング表示、エラーメッセージの具体化、レスポンシブ対応の調整など。
29. **パフォーマンス:** 必要に応じてバックエンドの並列処理数調整、フロントエンドのレンダリング最適化。
30. **テストカバレッジ向上:** 不足しているテストケースを追加。
31. **(PR作成 5: 改善)**

**フェーズ 6: デプロイ準備とドキュメント**

32. **Dockerfile作成:** `server-app` 用のDockerfileを作成。
33. **デプロイ設定:**
    *   `server-app` を Google Cloud Run にデプロイする設定 (Cloud Build トリガー等)。
    *   `web-app` を Firebase Hosting にデプロイする設定 (GitHub Actions 等)。
34. **README更新:** プロジェクト概要、セットアップ方法、開発手順、デプロイ方法などを詳細に記述。
35. **最終テスト:** デプロイ環境での動作確認。 