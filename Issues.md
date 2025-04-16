# 作業 Epic および Issue 一覧 (優先度順)

## Epic 1: 開発基盤構築
*ユーザーストーリー: 開発者は、モノレポ構成でバックエンドとフロントエンドの基本プロジェクトをセットアップできる。*

- [ ] **Issue 1:** [Setup] モノレポ基本設定: pnpm workspace, Turborepo, 共通設定 (`configs/*`), ルートBiomeを設定する。 (`Plan.md` Phase 1, Step 1)
- [ ] **Issue 2:** [Setup] `server-app` 初期設定: `@quick-start.mdc` 準拠でパッケージを作成し、基本的なヘルスチェックAPI (/health\_check) を実装する。 (`Plan.md` Phase 1, Step 2)
- [ ] **Issue 3:** [Setup] `web-app` 初期設定: `@quick-start.mdc` 準拠でパッケージを作成し、React, TailwindCSS, TanStack Query, React Hook Form, Zod 等の基本設定を行い、"Hello World" を表示する。 (`Plan.md` Phase 1, Step 3)
- [ ] **Issue 4:** [Setup] 初期リンター/フォーマッター適用: `pnpm lint`, `pnpm format` を実行し、初期コードに問題がないことを確認する。 (`Plan.md` Phase 1, Step 4)
- [ ] **Issue 5:** [PR] Epic 1 PR作成: 開発基盤構築完了のプルリクエストを作成する。 (`Plan.md` Phase 1, Step 5)

## Epic 2: UIプロトタイプ作成
*ユーザーストーリー: ユーザーは、Web画面でユーザー名を入力し、モックデータに基づいたチェック結果グリッド表示を確認できる。*

- [ ] **Issue 6:** [FE Mock] ユーザー名入力フォーム作成: `web-app` に、ユーザーがチェックしたいユーザー名を入力するためのフォームコンポーネントを `React Hook Form` と `Zod` を用いて作成する。 (`Plan.md` Phase 2, Step 6-1)
- [ ] **Issue 7:** [FE Mock] 結果表示グリッド作成: `web-app` に、プラットフォームのチェック結果をグリッド形式で表示するためのコンポーネントを `TailwindCSS` を用いて作成する。 (`Plan.md` Phase 2, Step 6-2)
- [ ] **Issue 8:** [FE Mock] プラットフォームカード作成: グリッド内に表示される、各プラットフォームのアイコン、名前、ステータス（利用可否など）を表示するカードコンポーネントを作成する。 (`Plan.md` Phase 2, Step 6-3)
- [ ] **Issue 9:** [FE Mock] モックデータ/関数定義: APIレスポンスを模倣したモックデータ（プラットフォームリストと各ステータス）と、それを非同期に返すモックAPI関数を定義する。 (`Plan.md` Phase 2, Step 7)
- [ ] **Issue 10:** [FE Mock] TanStack Query 設定: `web-app` に `TanStack Query` をセットアップし、グローバルなクエリクライアントを設定する。 (`Plan.md` Phase 2, Step 8)
- [ ] **Issue 11:** [FE Mock] モックAPI連携実装: フォーム送信時に `TanStack Query` を使用して Issue 9 で作成したモックAPI関数を呼び出し、状態管理を行うカスタムフックを作成する。 (`Plan.md` Phase 2, Step 9)
- [ ] **Issue 12:** [FE Mock] 表示ロジック実装: Issue 11 のカスタムフックから得られる状態（ローディング、成功、エラー、データ）に応じて、Issue 7, 8 で作成したグリッドとカードの表示を動的に更新する。 (`Plan.md` Phase 2, Step 10)
- [ ] **Issue 13:** [FE Mock] UIテスト実装: Issue 6, 7, 8, 11 で作成したコンポーネントやフックに対するユニットテスト・結合テストを `Vitest` と `@testing-library/react` で記述する。 (`Plan.md` Phase 2, Step 11)
- [ ] **Issue 14:** [FE Mock] リンター/フォーマッター適用: `pnpm lint --filter web-app`, `pnpm format --filter web-app` を実行する。 (`Plan.md` Phase 2, Step 12)
- [ ] **Issue 15:** [PR] Epic 2 PR作成: UIプロトタイプ作成完了のプルリクエストを作成する。 (`Plan.md` Phase 2, Step 13)

## Epic 3: コア機能実装 (バックエンド API)
*ユーザーストーリー: 開発者は、指定されたユーザー名の利用可否を複数のプラットフォームでチェックするバックエンドAPIを実装できる。*

- [ ] **Issue 16:** [BE API] APIエンドポイント定義: `server-app` に `/api/check/:username` という Hono ルートを作成し、リクエストパラメータとレスポンスボディの型を `Zod` スキーマで定義する。 (`Plan.md` Phase 3, Step 14)
- [ ] **Issue 17:** [BE API] プラットフォーム定義実装: チェック対象プラットフォームの情報（名前、アイコン識別子、チェック方法種別、URLテンプレート等）を管理する定義ファイル（例: `platforms.ts`）を作成する。 (`Plan.md` Phase 3, Step 15-1)
- [ ] **Issue 18:** [BE API] HTTPチェッカー実装: 指定されたURLにHTTPリクエストを送信し、ステータスコード等から利用可否を判定するチェック関数を実装する。 (`Plan.md` Phase 3, Step 15-2)
- [ ] **Issue 19:** [BE API] DNSチェッカー実装: 指定されたドメイン名のDNSレコードを `dns` モジュールで検索し、利用可否を判定するチェック関数を実装する。 (`Plan.md` Phase 3, Step 15-3)
- [ ] **Issue 20:** [BE API] APIハンドラー実装: Issue 16 のエンドポイントで、Issue 17 のプラットフォーム定義を読み込み、各プラットフォームに対して Issue 18, 19 のチェッカー関数を `Promise.allSettled` で並行実行し、結果を集約して返すロジックを実装する。 (`Plan.md` Phase 3, Step 16)
- [ ] **Issue 21:** [BE API] CORS設定: `server-app` に Hono の CORS ミドルウェアを導入し、`web-app` の開発サーバーオリジン (例: `http://localhost:3000`) からのリクエストを許可する。 (`Plan.md` Phase 3, Step 17)
- [ ] **Issue 22:** [BE API] エラーハンドリング実装: 各チェッカー関数内で発生しうるネットワークエラー、タイムアウト、予期せぬレスポンス等を捕捉し、APIレスポンスでエラー情報がわかるようにハンドリングする。 (`Plan.md` Phase 3, Step 18)
- [ ] **Issue 23:** [BE API] APIテスト実装: Issue 16, 18, 19, 20 で実装したAPIハンドラー、チェッカー関数に対するユニットテスト・統合テストを `Vitest` で記述する (外部アクセスはモックする)。 (`Plan.md` Phase 3, Step 19)
- [ ] **Issue 24:** [BE API] リンター/フォーマッター適用: `pnpm lint --filter server-app`, `pnpm format --filter server-app` を実行する。 (`Plan.md` Phase 3, Step 20)
- [ ] **Issue 25:** [PR] Epic 3 PR作成: バックエンドAPI実装完了のプルリクエストを作成する。 (`Plan.md` Phase 3, Step 21)

## Epic 4: 機能結合と動作確認
*ユーザーストーリー: ユーザーは、Web画面で入力したユーザー名に対する実際のチェック結果をグリッド表示で確認できる。*

- [ ] **Issue 26:** [Integration] API連携修正: `web-app` の Issue 11 で作成したカスタムフックを修正し、モックAPI関数の呼び出しを実際のバックエンドAPI (`/api/check/:username`) 呼び出しに差し替える。 (`Plan.md` Phase 4, Step 22)
- [ ] **Issue 27:** [Integration] Viteプロキシ設定: `web-app` の `vite.config.ts` に開発サーバー用のプロキシ設定を追加し、`/api` へのリクエストが `server-app` (例: `http://localhost:8787`) に転送されるようにする。 (`Plan.md` Phase 4, Step 23)
- [ ] **Issue 28:** [Integration] E2E動作確認: 開発サーバー (`pnpm dev`) を起動し、フロントエンドから実際にユーザー名を入力して、バックエンドAPI経由でチェック結果が取得・表示されることを確認する。 (`Plan.md` Phase 4, Step 24)
- [ ] **Issue 29:** [Integration] 結合テスト/微調整: 必要に応じて、フロントエンドとバックエンド間のデータの受け渡しに関するテストを追加したり、エラーハンドリングや表示の微調整を行う。 (`Plan.md` Phase 4, Step 25)
- [ ] **Issue 30:** [Integration] リンター/フォーマッター適用: `pnpm lint`, `pnpm format` を実行する。 (`Plan.md` Phase 4, Step 26)
- [ ] **Issue 31:** [PR] Epic 4 PR作成: 機能結合完了のプルリクエストを作成する。 (`Plan.md` Phase 4, Step 27)

## Epic 5: 品質向上と改善
*ユーザーストーリー: 開発者は、UI/UX、パフォーマンス、テストカバレッジを改善し、サービスの品質を高めることができる。*

- [ ] **Issue 32:** [Improve] UI/UX改善: ローディング中の表示、エラー発生時のメッセージ、各プラットフォームカードのデザイン、レスポンシブ対応など、全体的なUI/UXを改善する。 (`Plan.md` Phase 5, Step 28)
- [ ] **Issue 33:** [Improve] パフォーマンス検討: 必要であれば、バックエンドでのチェック並列数の調整や、フロントエンドでの不要な再レンダリング抑制など、パフォーマンス改善策を検討・実装する。 (`Plan.md` Phase 5, Step 29)
- [ ] **Issue 34:** [Improve] テストカバレッジ向上: テストカバレッジレポートを確認し、不足しているテストケース（特にエッジケースやエラーケース）を追加する。 (`Plan.md` Phase 5, Step 30)
- [ ] **Issue 35:** [PR] Epic 5 PR作成: 品質改善作業完了のプルリクエストを作成する。 (`Plan.md` Phase 5, Step 31)

## Epic 6: デプロイ準備とドキュメント
*ユーザーストーリー: 開発者は、アプリケーションを本番環境にデプロイし、利用・開発に必要なドキュメントを整備できる。*

- [ ] **Issue 36:** [Deploy] Dockerfile作成: `server-app` をコンテナ化するための `Dockerfile` を作成する。 (`Plan.md` Phase 6, Step 32)
- [ ] **Issue 37:** [Deploy] Cloud Run 設定: `server-app` を Google Cloud Run にデプロイするための設定（例: `cloudbuild.yaml`）を行う。 (`Plan.md` Phase 6, Step 33-1)
- [ ] **Issue 38:** [Deploy] Firebase Hosting 設定: `web-app` を Firebase Hosting にデプロイするための設定（例: `firebase.json`, GitHub Actions ワークフロー）を行う。 (`Plan.md` Phase 6, Step 33-2)
- [ ] **Issue 39:** [Deploy] README更新: プロジェクトの目的、技術スタック、ローカルでのセットアップ方法、開発手順、デプロイ手順などを網羅した `README.md` を作成・更新する。 (`Plan.md` Phase 6, Step 34)
- [ ] **Issue 40:** [Deploy] 最終テスト: 実際に Cloud Run と Firebase Hosting にデプロイし、本番環境でサービスが意図通り動作するか最終確認を行う。 (`Plan.md` Phase 6, Step 35) 