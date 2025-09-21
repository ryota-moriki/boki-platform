# 管理者権限セットアップガイド

## 📋 概要
日商簿記学習サイトの管理画面アクセス制限の設定方法を説明します。

**実装日**: 2025-09-17
**セキュリティレベル**: 高

---

## 🚨 重要な変更内容

### 実装された機能
1. **ロールベースアクセス制御 (RBAC)**
   - `users_profile`テーブルに`role`カラムを追加
   - `user`（一般ユーザー）と`admin`（管理者）の2種類のロール

2. **管理画面アクセス制限**
   - すべての`/admin/*`ページで管理者権限チェック
   - 非管理者は`/unauthorized`ページへリダイレクト

3. **データベースレベルの保護**
   - RLSポリシーで管理者のみがコンテンツ編集可能

---

## 🔧 セットアップ手順

### Step 1: データベースマイグレーション適用

1. Supabase Dashboardにアクセス
2. SQL Editorを開く
3. 以下のSQLを実行：

```sql
-- roleカラムを追加
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_users_profile_role ON users_profile(role);

-- 既存ユーザーにデフォルトロールを設定
UPDATE users_profile SET role = 'user' WHERE role IS NULL;
```

### Step 2: 管理者ユーザーの設定

特定のユーザーを管理者にする場合：

```sql
-- ユーザーIDを確認
SELECT id, username, display_name, role FROM users_profile;

-- 管理者権限を付与（USER_IDを実際のIDに置き換える）
UPDATE users_profile SET role = 'admin' WHERE id = 'USER_ID_HERE';

-- 例：テストユーザーを管理者にする
UPDATE users_profile SET role = 'admin' WHERE username = 'bokitester';
```

### Step 3: RLSポリシー適用（オプション）

管理者のみがコンテンツを編集できるようにする場合：

```sql
-- 既存のポリシーを削除（必要に応じて）
DROP POLICY IF EXISTS "Authenticated users can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Authenticated users can manage slides" ON slides;
DROP POLICY IF EXISTS "Authenticated users can manage questions" ON questions;

-- 新しい管理者専用ポリシーを作成
CREATE POLICY "Only admins can insert chapters" ON chapters
FOR INSERT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

-- 他のテーブルにも同様のポリシーを追加...
```

---

## 🔍 動作確認

### 管理者としてログインした場合
1. `/admin`にアクセス → ✅ アクセス可能
2. 章・スライド・問題の編集 → ✅ 可能

### 一般ユーザーとしてログインした場合
1. `/admin`にアクセス → 🚫 `/unauthorized`へリダイレクト
2. 学習機能の使用 → ✅ 可能

### 未ログインの場合
1. `/admin`にアクセス → 🚫 `/login`へリダイレクト

---

## 📂 関連ファイル

### 新規作成ファイル
- `/lib/auth/admin.ts` - 管理者権限チェック関数
- `/app/unauthorized/page.tsx` - アクセス拒否ページ
- `/supabase/migrations/20250916_add_admin_role.sql` - マイグレーションSQL

### 変更されたファイル
- すべての`/app/admin/**/page.tsx` - 権限チェック追加

---

## 🛠 トラブルシューティング

### 問題: 管理画面にアクセスできない

**原因1**: roleカラムが存在しない
```sql
-- 確認
SELECT column_name FROM information_schema.columns
WHERE table_name = 'users_profile';

-- 解決
ALTER TABLE users_profile
ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));
```

**原因2**: ユーザーが管理者でない
```sql
-- 確認
SELECT id, username, role FROM users_profile WHERE id = auth.uid();

-- 解決
UPDATE users_profile SET role = 'admin' WHERE id = 'YOUR_USER_ID';
```

### 問題: コンテンツを編集できない

**原因**: RLSポリシーの問題
```sql
-- 一時的に全認証ユーザーに許可（開発環境のみ）
CREATE POLICY "Authenticated users can manage content" ON chapters
FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🔐 セキュリティベストプラクティス

1. **本番環境では最小権限の原則を守る**
   - 管理者は最小限のユーザーのみ
   - 定期的な権限レビュー

2. **監査ログの実装（将来）**
   - 管理操作のログ記録
   - 不正アクセスの検知

3. **二要素認証の実装（将来）**
   - 管理者アカウントには必須

---

## 📊 現在の状況

| 項目 | ステータス |
|------|-----------|
| roleカラム追加 | ⚠️ 要手動実行 |
| 権限チェック実装 | ✅ 完了 |
| アクセス拒否ページ | ✅ 完了 |
| RLSポリシー | ⚠️ 要手動実行 |
| 管理者設定 | ⚠️ 要手動実行 |

---

## 📝 次のステップ

1. **即座に実施すべき**
   - [ ] Supabaseでマイグレーション実行
   - [ ] 管理者ユーザーを最低1名設定
   - [ ] 動作確認

2. **本番公開前に実施**
   - [ ] RLSポリシーの完全実装
   - [ ] 管理者権限付与プロセスの文書化
   - [ ] セキュリティ監査

3. **将来的な改善**
   - [ ] 管理者操作ログ
   - [ ] 権限の細分化（読み取り専用管理者など）
   - [ ] 二要素認証