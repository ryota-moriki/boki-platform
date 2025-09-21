import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function updateQuestion(id: string, formData: FormData) {
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
  const options = [
    { id: 'a', text: option1 },
    { id: 'b', text: option2 },
    { id: 'c', text: option3 },
    { id: 'd', text: option4 }
  ]

  const { error } = await supabase
    .from('questions')
    .update({
      chapter_id: chapterId,
      slide_id: slideId,
      question_type: questionType,
      question_text: questionText,
      options: options,
      correct_answer: correctAnswer,
      explanation: explanation,
      order_index: orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating question:', error)
    return
  }

  revalidatePath('/admin/questions')
  redirect('/admin/questions')
}

async function deleteQuestion(id: string) {
  'use server'

  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting question:', error)
    return
  }

  revalidatePath('/admin/questions')
  redirect('/admin/questions')
}

export default async function EditQuestion({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check admin permission
  await requireAdmin()

  const { id } = await params
  const supabase = await createClient()

  // 問題情報を取得
  const { data: question } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (!question) {
    notFound()
  }

  // 章一覧を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title')
    .order('order_index', { ascending: true })

  // スライド一覧を取得
  const { data: slides } = await supabase
    .from('slides')
    .select('id, title, chapter_id')
    .order('order_index', { ascending: true })

  // 選択肢を展開
  const optionA = question.options?.find((o: any) => o.id === 'a')?.text || question.options?.[0]?.text || ''
  const optionB = question.options?.find((o: any) => o.id === 'b')?.text || question.options?.[1]?.text || ''
  const optionC = question.options?.find((o: any) => o.id === 'c')?.text || question.options?.[2]?.text || ''
  const optionD = question.options?.find((o: any) => o.id === 'd')?.text || question.options?.[3]?.text || ''

  // 正解の選択肢を変換（数字から英字へ）
  const correctAnswerMap: { [key: string]: string } = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' }
  const correctAnswerValue = correctAnswerMap[question.correct_answer] || question.correct_answer

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          問題編集
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          問題を編集します
        </p>
      </div>

      <form action={updateQuestion.bind(null, id)} className="space-y-6 max-w-4xl">
        {/* 問題種別 */}
        <div>
          <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">
            問題種別 *
          </label>
          <select
            id="question_type"
            name="question_type"
            required
            defaultValue={question.question_type}
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
            defaultValue={question.chapter_id}
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
            defaultValue={question.slide_id || ''}
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
            defaultValue={question.question_text}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 選択肢 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="option_1" className="block text-sm font-medium text-gray-700">
              選択肢 A *
            </label>
            <input
              type="text"
              id="option_1"
              name="option_1"
              required
              defaultValue={optionA}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_2" className="block text-sm font-medium text-gray-700">
              選択肢 B *
            </label>
            <input
              type="text"
              id="option_2"
              name="option_2"
              required
              defaultValue={optionB}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_3" className="block text-sm font-medium text-gray-700">
              選択肢 C *
            </label>
            <input
              type="text"
              id="option_3"
              name="option_3"
              required
              defaultValue={optionC}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option_4" className="block text-sm font-medium text-gray-700">
              選択肢 D *
            </label>
            <input
              type="text"
              id="option_4"
              name="option_4"
              required
              defaultValue={optionD}
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
            defaultValue={correctAnswerValue}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">正解を選択してください</option>
            <option value="a">選択肢 A</option>
            <option value="b">選択肢 B</option>
            <option value="c">選択肢 C</option>
            <option value="d">選択肢 D</option>
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
            defaultValue={question.explanation || ''}
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
            defaultValue={question.order_index}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-between">
          <form action={deleteQuestion.bind(null, id)}>
            <button
              type="submit"
              className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={(e) => {
                if (!confirm('この問題を削除してもよろしいですか？')) {
                  e.preventDefault()
                }
              }}
            >
              削除
            </button>
          </form>

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
              更新
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}