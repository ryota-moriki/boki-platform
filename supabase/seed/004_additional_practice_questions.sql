-- 第1章の追加練習問題（複数問題対応のテスト用）

-- 第1章の「簿記の必要性」スライドに問題を追加
WITH chapter1 AS (
  SELECT id FROM public.chapters WHERE title = '第1章: 簿記の基礎'
),
slide2 AS (
  SELECT id FROM public.slides WHERE chapter_id = (SELECT id FROM chapter1) AND order_index = 2
)
INSERT INTO public.questions (chapter_id, slide_id, question_type, question_text, options, correct_answer, explanation, order_index)
SELECT 
  chapter1.id,
  slide2.id,
  'slide_practice',
  '簿記が「ビジネスの共通言語」と呼ばれる理由として最も適切なものはどれですか？',
  '[{"id": "a", "text": "世界中で同じ方法で記録されているから"}, {"id": "b", "text": "数字で表現されるため言語の壁がないから"}, {"id": "c", "text": "企業の財政状態や経営成績を統一的に表現できるから"}, {"id": "d", "text": "コンピューターで処理できるから"}]'::jsonb,
  'c',
  '簿記は企業の財政状態や経営成績を統一的な方法で表現できるため、「ビジネスの共通言語」と呼ばれています。これにより、異なる企業や業界でも比較が可能になります。',
  1
FROM chapter1, slide2;

-- 第1章の「5つの要素」スライドに追加問題
WITH chapter1 AS (
  SELECT id FROM public.chapters WHERE title = '第1章: 簿記の基礎'
),
slide5 AS (
  SELECT id FROM public.slides WHERE chapter_id = (SELECT id FROM chapter1) AND order_index = 5
)
INSERT INTO public.questions (chapter_id, slide_id, question_type, question_text, options, correct_answer, explanation, order_index)
SELECT 
  chapter1.id,
  slide5.id,
  'slide_practice',
  q.question_text,
  q.options,
  q.correct_answer,
  q.explanation,
  q.order_index
FROM chapter1, slide5,
(VALUES
  ('次のうち「資産」に分類されるものはどれですか？',
   '[{"id": "a", "text": "買掛金"}, {"id": "b", "text": "売掛金"}, {"id": "c", "text": "借入金"}, {"id": "d", "text": "資本金"}]'::jsonb,
   'b',
   '売掛金は、商品を販売したがまだ代金を受け取っていない債権であり、将来現金になる資産です。買掛金・借入金は負債、資本金は純資産に分類されます。',
   1),
  
  ('「収益 - 費用」で計算されるものは何ですか？',
   '[{"id": "a", "text": "資産"}, {"id": "b", "text": "負債"}, {"id": "c", "text": "利益"}, {"id": "d", "text": "資本"}]'::jsonb,
   'c',
   '収益から費用を差し引いた差額が利益となります。これは企業の一定期間における経営成績を表す重要な指標です。',
   2)
) AS q(question_text, options, correct_answer, explanation, order_index);

-- 第2章の「仕訳とは」スライドに練習問題を追加
WITH chapter2 AS (
  SELECT id FROM public.chapters WHERE title = '第2章: 仕訳の基本'
),
slide1 AS (
  SELECT id FROM public.slides WHERE chapter_id = (SELECT id FROM chapter2) AND order_index = 1
)
INSERT INTO public.questions (chapter_id, slide_id, question_type, question_text, options, correct_answer, explanation, order_index)
SELECT 
  chapter2.id,
  slide1.id,
  'slide_practice',
  '現金200円で商品を仕入れた場合の仕訳として正しいものはどれですか？',
  '[{"id": "a", "text": "(借方)商品 200 (貸方)現金 200"}, {"id": "b", "text": "(借方)仕入 200 (貸方)現金 200"}, {"id": "c", "text": "(借方)現金 200 (貸方)仕入 200"}, {"id": "d", "text": "(借方)現金 200 (貸方)商品 200"}]'::jsonb,
  'b',
  '商品を仕入れた場合は「仕入」勘定を使用します。現金が減少するので貸方に、仕入（費用）が発生するので借方に記入します。',
  1
FROM chapter2, slide1;