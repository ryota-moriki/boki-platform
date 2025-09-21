import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import Navigation from '@/components/navigation/Navigation'

export default async function ChaptersPage() {
  const supabase = await createClient()
  
  // 認証チェック
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 章一覧を取得（全章表示）
  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('*')
    .order('order_index', { ascending: true })

  // 章ごとの進捗を計算
  const chapterProgress: Record<string, { completed: number; total: number }> = {}
  
  if (chapters) {
    for (const chapter of chapters) {
      try {
        // その章の全スライドを取得
        const { data: slides } = await supabase
          .from('slides')
          .select('id')
          .eq('chapter_id', chapter.id)
        
        const totalSlides = slides?.length || 0
        let completedCount = 0
        
        if (totalSlides > 0 && slides) {
          // その章の完了したスライドを取得
          const { data: completedSlides } = await supabase
            .from('user_progress')
            .select('slide_id')
            .eq('user_id', user.id)
            .eq('is_completed', true)
            .in('slide_id', slides.map(s => s.id))
          
          completedCount = completedSlides?.length || 0
        }
        
        chapterProgress[chapter.id] = {
          completed: completedCount,
          total: totalSlides
        }
      } catch (error) {
        // エラーが発生してもその章の進捗は0にして続行
        chapterProgress[chapter.id] = {
          completed: 0,
          total: 0
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <Navigation currentPage="chapters" />

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Breadcrumb items={[{ label: '章一覧' }]} />
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              章一覧
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2">
            {chapters?.map((chapter) => {
              const progress = chapterProgress[chapter.id]
              const progressPercentage = progress?.total > 0 
                ? Math.round((progress.completed / progress.total) * 100)
                : 0

              return (
                <div
                  key={chapter.id}
                  className={`rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                    !chapter.is_published ? 'opacity-60' : ''
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {chapter.description}
                    </p>
                  </div>

                  {chapter.is_published && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">進捗</span>
                        <span className="font-medium text-gray-900">
                          {progress?.completed || 0} / {progress?.total || 0} スライド
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600 transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="mt-1 text-right text-xs text-gray-500">
                        {progressPercentage}%
                      </div>
                    </div>
                  )}

                  {chapter.is_published ? (
                    <Link
                      href={`/chapters/${chapter.id}`}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      学習を始める
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex w-full justify-center rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed"
                    >
                      準備中
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {(!chapters || chapters.length === 0) && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500">章がまだ登録されていません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}