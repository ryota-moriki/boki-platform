import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/actions/auth'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentActivity from '@/components/dashboard/RecentActivity'
import QuickActions from '@/components/dashboard/QuickActions'
import ProgressChart from '@/components/dashboard/ProgressChart'
import Navigation from '@/components/navigation/Navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // ユーザープロフィール取得
  const { data: profile } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  // 全章の情報を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select(`
      id,
      title,
      description,
      order_index,
      slides (id),
      questions (id, question_type)
    `)
    .order('order_index')

  // ユーザーの進捗を取得
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('slide_id, is_completed, completed_at')
    .eq('user_id', user.id)
    .eq('is_completed', true)

  // ユーザーの回答履歴を取得（最近のもの）
  const { data: recentAnswers } = await supabase
    .from('user_answers')
    .select(`
      id,
      is_correct,
      answered_at,
      questions (
        id,
        question_text,
        question_type,
        chapter_id
      )
    `)
    .eq('user_id', user.id)
    .order('answered_at', { ascending: false })
    .limit(10)

  // 統計情報を計算
  const totalSlides = chapters?.reduce((sum, ch) => sum + (ch.slides?.length || 0), 0) || 0
  const completedSlides = userProgress?.length || 0
  const progressPercentage = totalSlides > 0 ? Math.round((completedSlides / totalSlides) * 100) : 0

  // 章ごとの進捗を計算
  const chapterProgress = chapters?.map(chapter => {
    const chapterSlideIds = chapter.slides?.map(s => s.id) || []
    const completedInChapter = userProgress?.filter(p => chapterSlideIds.includes(p.slide_id)).length || 0
    const totalInChapter = chapterSlideIds.length
    
    return {
      id: chapter.id,
      title: chapter.title,
      totalSlides: totalInChapter,
      completedSlides: completedInChapter,
      progressPercentage: totalInChapter > 0 ? Math.round((completedInChapter / totalInChapter) * 100) : 0
    }
  }) || []

  // 最後に学習した章を特定
  const lastCompletedProgress = userProgress?.sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  )[0]

  let lastStudiedChapter = null
  if (lastCompletedProgress) {
    // スライドIDから章を特定
    const { data: slide } = await supabase
      .from('slides')
      .select('chapter_id')
      .eq('id', lastCompletedProgress.slide_id)
      .single()
    
    if (slide) {
      lastStudiedChapter = chapters?.find(ch => ch.id === slide.chapter_id)
    }
  }

  // 正答率を計算
  const totalAnswers = recentAnswers?.length || 0
  const correctAnswers = recentAnswers?.filter(a => a.is_correct).length || 0
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <Navigation currentPage="dashboard" />

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                ダッシュボード
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                ようこそ、{profile?.display_name || profile?.username || 'ユーザー'}さん
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* 統計情報 */}
          <DashboardStats
            progressPercentage={progressPercentage}
            completedSlides={completedSlides}
            totalSlides={totalSlides}
            accuracy={accuracy}
            totalChapters={chapters?.length || 0}
            completedChapters={chapterProgress.filter(ch => ch.progressPercentage === 100).length}
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* 学習進捗グラフ */}
            <div className="lg:col-span-2">
              <ProgressChart chapterProgress={chapterProgress} />
            </div>

            {/* クイックアクション */}
            <div className="lg:col-span-1">
              <QuickActions 
                lastStudiedChapter={lastStudiedChapter}
                nextChapter={chapterProgress.find(ch => ch.progressPercentage < 100)}
              />
            </div>
          </div>

          {/* 最近の学習活動 */}
          <div className="mt-8">
            <RecentActivity 
              recentAnswers={recentAnswers}
              chapters={chapters}
            />
          </div>
        </div>
      </main>
    </div>
  )
}