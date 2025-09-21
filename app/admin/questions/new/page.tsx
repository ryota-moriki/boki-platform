import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function createQuestion(formData: FormData) {
  'use server'

  const supabase = await createClient()

  // フォームデータを取得
  const questionType = formData.get('question_type') as string
  const chapterId = formData.get('chapter_id') as string
  const slideId = formData.get('slide_id') as string || null
  const questionText = formData.get('question_text') as string
  const option1 = formData.get('option_1') as string
  const option2 = formData.get('option_2') as string
  const option3 = formData.get('option_3') as string
  const option4 = formData.get('option_4') as string
  const correctAnswer = formData.get('correct_answer') as string
  const explanation = formData.get('explanation') as string || null
  const orderIndex = parseInt(formData.get('order_index') as string) || 1

  // 選択肢をJSONB形式で作成
  const options = {
    "1": option1,
    "2": option2,
    "3": option3,
    "4": option4
  }

  try {
    const { error } = await supabase
      .from('questions')
      .insert({
        chapter_id: chapterId,
        slide_id: slideId,
        question_type: questionType,
        question_text: questionText,
        options: options,
        correct_answer: correctAnswer,
        explanation: explanation,
        order_index: orderIndex
      })

    if (error) {
      console.error('Error creating question:', error)
      throw error
    }

    redirect('/admin/questions')
  } catch (error) {
    console.error('Error creating question:', error)
    // エラーハンドリング - 実際のアプリではより適切な処理が必要
    throw error
  }
}

export default async function NewQuestion() {
  // Check admin permission
  await requireAdmin()

  const supabase = await createClient()

  // 章一覧を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title')
    .order('order_index', { ascending: true })

  // スライド一覧を取得（章ごとに整理）
  const { data: slides } = await supabase
    .from('slides')
    .select('id, title, chapter_id')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            新規問題作成
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            新しい練習問題または確認テスト問題を作成します
          </p>
        </div>
      </div>

      <form action={createQuestion} className="space-y-6 max-w-4xl">
        {/* 問題種別 */}
        <div>
          <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">
            問題種別 *
          </label>
          <select
            id="question_type"
            name="question_type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">種別を選択してください</option>
            <option value="slide_practice">スライド練習問題</option>
            <option value="chapter_test">章末テスト</option>
          </select>
        </div>

        {/* 所属章 */}
        <div>
          <label htmlFor="chapter_id" className="block text-sm font-medium text-gray-700">
            所属章 *
          </label>
          <select
            id="chapter_id"
            name="chapter_id"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">章を選択してください</option>
            {chapters?.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>

        {/* 関連スライド（オプション） */}
        <div>
          <label htmlFor="slide_id" className="block text-sm font-medium text-gray-700">
            関連スライド
          </label>
          <select
            id="slide_id"
            name="slide_id"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">スライドを選択してください（オプション）</option>
            {slides?.map((slide) => (
              <option key={slide.id} value={slide.id}>
                {slide.title}
              </option>
            ))}
          </select>
        </div>

        {/* 問題文 */}
        <div>
          <label htmlFor="question_text" className="block text-sm font-medium text-gray-700">
            問題文 *
          </label>
          <textarea
            id="question_text"
            name="question_text"
            rows={4}
            required
            placeholder="問題文を入力してください"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 選択肢 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="option_1" className="block text-sm font-medium text-gray-700">
              選択肢 1 *
            </label>
            <input
              type="text"
              id="option_1"
              name="option_1"
              required
              placeholder="選択肢1を入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_2" className="block text-sm font-medium text-gray-700">
              選択肢 2 *
            </label>
            <input
              type="text"
              id="option_2"
              name="option_2"
              required
              placeholder="選択肢2を入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_3" className="block text-sm font-medium text-gray-700">
              選択肢 3 *
            </label>
            <input
              type="text"
              id="option_3"
              name="option_3"
              required
              placeholder="選択肢3を入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_4" className="block text-sm font-medium text-gray-700">
              選択肢 4 *
            </label>
            <input
              type="text"
              id="option_4"
              name="option_4"
              required
              placeholder="選択肢4を入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 正解 */}
        <div>
          <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700">
            正解 *
          </label>
          <select
            id="correct_answer"
            name="correct_answer"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">正解を選択してください</option>
            <option value="1">選択肢 1</option>
            <option value="2">選択肢 2</option>
            <option value="3">選択肢 3</option>
            <option value="4">選択肢 4</option>
          </select>
        </div>

        {/* 解説 */}
        <div>
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
            解説
          </label>
          <textarea
            id="explanation"
            name="explanation"
            rows={3}
            placeholder="解説を入力してください（オプション）"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 順序 */}
        <div>
          <label htmlFor="order_index" className="block text-sm font-medium text-gray-700">
            表示順序
          </label>
          <input
            type="number"
            id="order_index"
            name="order_index"
            min="1"
            defaultValue="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          <Link
            href="/admin/questions"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            作成
          </button>
        </div>
      </form>
    </div>
  )
}