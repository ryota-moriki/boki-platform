# チケット #002: Supabase設定

## 概要
Supabaseプロジェクトの作成と基本設定

## 期限
Week 1

## 担当
開発チーム

## 詳細

### 目的
- Supabaseプロジェクトの作成
- 環境変数の設定
- 接続確認

### ToDo
- [x] Supabaseアカウント作成
- [x] 新規プロジェクト作成
  - [x] プロジェクト名: boki-learning-platform
  - [x] リージョン: Northeast Asia (Tokyo)
  - [x] データベースパスワード設定
- [x] API情報の取得
  - [x] Project URL取得
  - [x] anon public key取得
- [x] .env.local作成
  - [x] NEXT_PUBLIC_SUPABASE_URL設定
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY設定
- [x] Supabaseパッケージインストール
  - [x] @supabase/supabase-js
  - [x] @supabase/ssr
- [x] Supabaseクライアント作成
  - [x] Server Component用クライアント
  - [x] Browser Component用クライアント
- [x] 接続テスト

### 技術仕様
- Supabase PostgreSQL
- Supabase Auth
- @supabase/supabase-js
- @supabase/ssr

### 完了条件
- Supabaseプロジェクトが作成されている
- 環境変数が正しく設定されている
- Supabaseへの接続が確認できる

### メモ
- 無料プランでスタート
- Row Level Security (RLS)を後で設定予定