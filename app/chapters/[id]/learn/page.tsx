import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SlideViewer from '@/components/learning/SlideViewer'

export default async function ChapterLearnPage({
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

  // 関連する問題を取得
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('chapter_id', id)
    .in('slide_id', slides.map(s => s.id))

  const questionsBySlide = new Map()
  questions?.forEach(q => {
    if (q.slide_id) {
      if (!questionsBySlide.has(q.slide_id)) {
        questionsBySlide.set(q.slide_id, [])
      }
      questionsBySlide.get(q.slide_id).push(q)
    }
  })

  return (
    <SlideViewer
      chapter={chapter}
      slides={slides}
      userProgress={progressMap}
      questionsBySlide={questionsBySlide}
      userId={user.id}
    />
  )
}