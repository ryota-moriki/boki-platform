# Vercelデプロイ手順

## 1. 必要な準備

### 前提条件
- GitHubアカウント
- Vercelアカウント（GitHubアカウントでサインイン可能）
- リポジトリがGitHubにプッシュされていること

## 2. Vercelアカウント作成とプロジェクト連携

1. [Vercel](https://vercel.com/)にアクセス
2. "Sign Up"からGitHubアカウントでサインイン
3. ダッシュボードで「Add New Project」をクリック
4. GitHubリポジトリ「boki-platform」をインポート

## 3. プロジェクト設定

### 基本設定
- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: .next （デフォルト）

### 環境変数の設定

以下の環境変数をVercelダッシュボードで設定：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**重要**: これらの値はSupabaseダッシュボードから取得してください。

## 4. デプロイ実行

1. 環境変数設定後、「Deploy」ボタンをクリック
2. ビルドログを確認
3. デプロイ完了後、自動生成されるURLでアクセス確認

## 5. カスタムドメイン設定（オプション）

1. Vercelプロジェクトの「Settings」→「Domains」
2. カスタムドメインを追加
3. DNS設定を行う

## 6. デプロイ後の確認事項

### 動作確認チェックリスト
- [ ] トップページが表示される
- [ ] ログイン・サインアップが機能する
- [ ] ダッシュボードにアクセスできる
- [ ] 章一覧が表示される
- [ ] スライド学習が動作する
- [ ] 問題回答が機能する
- [ ] 進捗が正しく記録される
- [ ] 管理画面が動作する（管理者権限で）

### エラー時の対処

1. **ビルドエラー**
   - ログを確認して型エラーを修正
   - 依存関係の問題を解決

2. **Supabase接続エラー**
   - 環境変数が正しく設定されているか確認
   - Supabaseプロジェクトが稼働しているか確認

3. **認証エラー**
   - Supabase AuthのサイトURLを更新
   - リダイレクトURLの設定を確認

## 7. 自動デプロイ設定

GitHubのmainブランチへのプッシュで自動デプロイが実行されます。

### ブランチ設定
- **Production Branch**: main
- **Preview Branches**: その他のブランチ

## 8. モニタリング

### Vercel Analytics
- プロジェクトの「Analytics」タブで有効化
- パフォーマンスメトリクスを確認

### ログ確認
- 「Functions」タブでサーバーサイドログを確認
- エラートラッキングツール（Sentry等）の導入を検討

## 9. セキュリティ設定

### 推奨設定
- HTTPS強制（デフォルトで有効）
- セキュリティヘッダーの設定（vercel.jsonで設定済み）
- Rate limiting（必要に応じて追加）

## 10. トラブルシューティング

### よくある問題

1. **「Module not found」エラー**
   - package.jsonの依存関係を確認
   - node_modulesをローカルで削除して再インストール

2. **型エラー**
   - TypeScriptの型定義を修正
   - any型の使用箇所を確認

3. **環境変数が読み込まれない**
   - Vercelダッシュボードで正しく設定されているか確認
   - プレフィックス（NEXT_PUBLIC_）を確認

## サポート

問題が解決しない場合：
1. Vercelのドキュメントを参照
2. Next.jsのドキュメントを確認
3. Supabaseのドキュメントを確認