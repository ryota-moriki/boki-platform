日商簿記学習サイト MVP 要件定義書
1. プロジェクト概要
1.1 プロジェクト名
日商簿記学習サイト
1.2 目的
日商簿記検定の学習をサポートするWebアプリケーションのMVPを開発し、効果的な学習体験を提供する
1.3 開発期間
約1ヶ月
2. ターゲットユーザー
2.1 対象級

MVP範囲: 日商簿記3級のみ
将来展開: 2級、1級も対応予定

2.2 対象者

簿記初学者
基礎知識がある学習者
両方のレベルに対応

3. 機能要件
3.1 認証機能

ユーザー登録: ユーザー名・パスワードによる簡単な登録
ログイン: ユーザー名・パスワードによるログイン
認証方式: Supabase Auth使用
将来機能: より高度な認証機能（メール認証等）

3.2 学習機能
3.2.1 コンテンツ構成

章数: 約10章構成
スライド: 全体で約50枚
学習フロー: スライド → 関連問題 → 確認テスト

3.2.2 スライド機能

スライド形式での教材表示
章ごとの構成
順次学習の進行

3.2.3 問題機能

問題形式: 選択式のみ
問題種別:

スライドに関連した練習問題
章末の確認テスト（各章約10問）


解答後の解説表示

3.3 進捗管理機能

スライド閲覧状況: 完了/未完了の管理
問題正答率: 問題ごとの正答率記録
確認テスト結果: テスト結果の保存・表示
全体進捗: 学習完了率の表示

3.4 管理機能

コンテンツ編集: 管理画面での編集可能
章管理: 章の追加・編集・削除
スライド管理: スライドの追加・編集・削除
問題管理: 問題の追加・編集・削除

4. 技術要件
4.1 技術スタック

フロントエンド: Next.js 14 (App Router)
スタイリング: Tailwind CSS
データベース: Supabase PostgreSQL
認証: Supabase Auth
デプロイ: Vercel

4.2 対応デバイス

レスポンシブ対応: スマートフォン・タブレット・PC対応

4.3 デザイン方針

方向性: シンプルなデザイン
ユーザビリティ: 直感的で使いやすいUI

5. データベース設計
5.1 テーブル構成
users_profile

Supabaseのauth.usersを拡張
ユーザープロフィール情報を管理

chapters

学習章の管理
タイトル、説明、順序、公開状態

slides

スライドコンテンツの管理
章との紐づけ、順序管理

questions

問題の管理
スライド問題と確認テスト問題の両方に対応
選択肢、正解、解説を含む

user_progress

ユーザーの学習進捗管理
スライド完了状況

user_answers

ユーザーの回答履歴
正答率計算用

6. 画面構成
6.1 ユーザー向け画面

ログイン・登録画面
ダッシュボード: 学習進捗の概要表示
章一覧画面: 10章の一覧と進捗状況
学習画面: スライド表示と関連問題
確認テスト画面: 章末テスト実施

6.2 管理者向け画面

管理画面: コンテンツ編集機能

7. 開発フェーズ
Week 1: 基盤構築

Next.jsプロジェクトセットアップ
Supabase設定とデータベース構築
基本認証機能実装

Week 2: 学習機能

章・スライド表示機能実装
問題機能実装
進捗管理機能実装

Week 3: 管理機能

管理画面でのコンテンツ編集機能実装
テストデータ投入
基本的な動作確認

Week 4: 仕上げ

UI/UX調整
レスポンシブ対応最適化
総合テスト・デバッグ

8. MVP後の展開予定
8.1 機能拡張

有料プラン機能
2級・1級対応
より高度な認証機能
SNS連携

8.2 競合差別化

今後検討予定
ユーザーフィードバックを基に差別化ポイントを決定

9. 成功指標（参考）
9.1 技術的指標

MVP期間内での基本機能完成
レスポンシブ対応完了
基本的なユーザビリティテスト通過

9.2 今後の検討事項

ユーザー数
学習継続率
合格率への貢献


10. Next.js App Routerベストプラクティス

ディレクトリ構造:
- app/: ルーティングとページコンポーネント
- components/: 再利用可能なUIコンポーネント  
- lib/: ユーティリティ関数
- types/: TypeScript型定義
- actions/: Server Actions

ファイル規約:
- page.tsx: ページコンポーネント
- layout.tsx: レイアウトコンポーネント
- loading.tsx: ローディングUI
- error.tsx: エラーハンドリング
- not-found.tsx: 404ページ
- route.ts: Route Handlers (API)

ルーティングパターン:
- [id]: 動的セグメント
- [...slug]: キャッチオール
- [[...slug]]: オプショナルキャッチオール
- (group): ルートグループ
- @folder: パラレルルート
- (.): インターセプトルート

Server Components原則:
- デフォルトでServer Components使用
- 'use client'は必要最小限
- async/awaitでの直接データフェッチ
- Server Actionsでのデータ変更

Client Components使用場面:
- イベントハンドラー（onClick等）
- useState、useEffect等のフック
- ブラウザAPI使用時

パフォーマンス:
- next/imageで画像最適化
- next/fontでフォント最適化  
- 動的インポートでコード分割
- Suspenseで段階的レンダリング

キャッシング:
- fetch自動キャッシュ活用
- revalidateで再検証制御
- unstable_cacheでカスタムキャッシュ

メタデータ:
- export const metadataで静的設定
- generateMetadata()で動的生成

11. Supabase統合ルール

認証実装の原則:
- middlewareでの認証トークンのリフレッシュ
- Server ComponentsでのSupabase Server Client使用
- Client ComponentsでのSupabase Browser Client使用
- 各リクエストごとに新しいSupabaseクライアントを作成

必須パッケージ:
- @supabase/supabase-js
- @supabase/ssr

クライアントの種類と用途:
1. Server Component Client:
   - Server Components内でのデータフェッチ
   - Server Actions内での操作
   - Route Handlers内での処理
   
2. Browser Client:
   - Client Components内での操作
   - ブラウザサイドでの認証処理
   - リアルタイムサブスクリプション

Middleware設定の必須要件:
- 期限切れ認証トークンのリフレッシュ
- リフレッシュされたトークンをServer Componentsに渡す
- ブラウザサイドの認証トークンを更新

セキュリティ重要事項:
- ページ保護やデータ保護には必ずsupabase.auth.getUser()を使用
- サーバーコードではsupabase.auth.getSession()を信頼しない（なりすまし可能）
- 認証が必要なリクエストではNext.jsのデータキャッシングをオプトアウト

データアクセス:
- Server ActionsでのCRUD操作
- リアルタイムサブスクリプションの適切な管理
- Row Level Security (RLS)の活用

メール認証設定:
- サーバーサイド認証をサポートするメールテンプレートのカスタマイズ
- 確認URLにtoken_hashとtypeを含める設定

12. テストアカウント情報

開発・テスト用アカウント:
- メールアドレス: boki.tester@example.com
- パスワード: TestBoki2025!
- ユーザー名: bokitester

その他の登録済みアカウント:
- test@example.com
- testuser1@test.com

文書作成日: 2025年9月6日
バージョン: 1.2
作成者: 開発チーム
最終更新: 2025年9月14日