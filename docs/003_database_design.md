# チケット #003: データベース設計

## 概要
Supabaseデータベースのテーブル設計と作成

## 期限
Week 1

## 担当
開発チーム

## 詳細

### 目的
- 必要なテーブルの設計
- マイグレーションファイルの作成
- 初期データの投入

### ToDo
- [x] テーブル設計
  - [x] users_profile（ユーザープロフィール）
  - [x] chapters（章）
  - [x] slides（スライド）
  - [x] questions（問題）
  - [x] user_progress（進捗）
  - [x] user_answers（回答履歴）
- [x] リレーション設計
  - [x] chapters -> slides (1対多)
  - [x] slides -> questions (1対多)
  - [x] users -> user_progress (1対多)
  - [x] users -> user_answers (1対多)
- [x] インデックス設計
- [x] RLS（Row Level Security）ポリシー作成
- [x] SQLマイグレーション作成
- [x] Supabase Dashboardでテーブル作成
- [x] 初期データ（サンプル）投入

### テーブル詳細

#### users_profile
- id (uuid, PK)
- username (text, unique)
- created_at (timestamp)
- updated_at (timestamp)

#### chapters
- id (uuid, PK)
- title (text)
- description (text)
- order_index (integer)
- is_published (boolean)
- created_at (timestamp)

#### slides
- id (uuid, PK)
- chapter_id (uuid, FK)
- title (text)
- content (text)
- order_index (integer)
- created_at (timestamp)

#### questions
- id (uuid, PK)
- slide_id (uuid, FK, nullable)
- chapter_id (uuid, FK)
- question_text (text)
- question_type (enum: 'slide', 'test')
- options (jsonb)
- correct_answer (text)
- explanation (text)
- order_index (integer)

#### user_progress
- id (uuid, PK)
- user_id (uuid, FK)
- slide_id (uuid, FK)
- completed (boolean)
- completed_at (timestamp)

#### user_answers
- id (uuid, PK)
- user_id (uuid, FK)
- question_id (uuid, FK)
- answer (text)
- is_correct (boolean)
- answered_at (timestamp)

### 完了条件
- すべてのテーブルが作成されている
- リレーションが正しく設定されている
- RLSポリシーが設定されている
- 基本的なCRUD操作が可能

### メモ
- auth.usersテーブルはSupabase Authが管理
- users_profileはauth.usersを拡張する形で使用