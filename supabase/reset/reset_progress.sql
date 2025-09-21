-- ユーザーの学習進捗をリセットするSQL
-- 開発・テスト用

-- 全てのユーザー進捗を削除
DELETE FROM public.user_progress;

-- 全ての回答履歴を削除
DELETE FROM public.user_answers;