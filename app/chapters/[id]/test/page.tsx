import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import TestStart from '@/components/test/TestStart'

export default async function ChapterTestPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 認証チェック
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 章情報を取得
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single()

  if (!chapter || chapterError) {
    notFound()
  }

  // 章のすべてのスライドが完了しているかチェック
  const { data: slides } = await supabase
    .from('slides')
    .select('id')
    .eq('chapter_id', id)

  if (!slides || slides.length === 0) {
    redirect(`/chapters/${id}`)
  }

  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('slide_id, is_completed')
    .eq('user_id', user.id)
    .in('slide_id', slides.map(s => s.id))

  const completedSlides = userProgress?.filter(p => p.is_completed).length || 0
  const allSlidesCompleted = completedSlides === slides.length

  if (!allSlidesCompleted) {
    redirect(`/chapters/${id}`)
  }

  // 章の確認テスト問題を取得
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select(`
      id,
      question_text,
      options,
      correct_answer,
      explanation,
      order_index
    `)
    .eq('chapter_id', id)
    .eq('question_type', 'chapter_test')
    .order('order_index', { ascending: true })

  if (!questions || questions.length === 0 || questionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">確認テストが見つかりません</h2>
          <p className="text-gray-600 mb-4">この章の確認テストはまだ準備されていません。</p>
          <a
            href={`/chapters/${id}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            章に戻る
          </a>
        </div>
      </div>
    )
  }

  // 前回のテスト結果を取得
  const { data: previousResults } = await supabase
    .from('user_answers')
    .select('question_id, is_correct, answered_at')
    .eq('user_id', user.id)
    .in('question_id', questions.map(q => q.id))
    .order('answered_at', { ascending: false })

  // 最新のテスト結果のみを取得（問題IDごと）
  const latestResults = new Map()
  previousResults?.forEach(result => {
    if (!latestResults.has(result.question_id)) {
      latestResults.set(result.question_id, result)
    }
  })

  const latestResultsArray = Array.from(latestResults.values()).map(result => ({
    question_id: result.question_id,
    is_correct: result.is_correct,
    created_at: result.answered_at
  }))

  return (
    <TestStart
      chapter={chapter}
      questions={questions}
      previousResults={latestResultsArray}
      userId={user.id}
    />
  )
}