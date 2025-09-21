import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChapterOverview from '@/components/learning/ChapterOverview'

export default async function ChapterDetailPage({
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
    redirect('/chapters')
  }

  // スライドを取得
  const { data: slides, error: slidesError } = await supabase
    .from('slides')
    .select('*')
    .eq('chapter_id', id)
    .order('order_index', { ascending: true })

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">スライドがありません</h2>
          <p className="text-gray-600">この章にはまだスライドが登録されていません。</p>
        </div>
      </div>
    )
  }

  // ユーザーの進捗を取得
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('slide_id, is_completed')
    .eq('user_id', user.id)
    .in('slide_id', slides.map(s => s.id))

  const progressMap = new Map(
    userProgress?.map(p => [p.slide_id, p.is_completed]) || []
  )

  // 確認テストの問題があるかチェック
  const { data: chapterTestQuestions } = await supabase
    .from('questions')
    .select('id')
    .eq('chapter_id', id)
    .eq('question_type', 'chapter_test')
    .limit(1)

  const hasChapterTest = (chapterTestQuestions?.length || 0) > 0

  return (
    <ChapterOverview
      chapter={chapter}
      slides={slides}
      userProgress={progressMap}
      hasChapterTest={hasChapterTest}
      userId={user.id}
    />
  )
}