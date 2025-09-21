import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '@/actions/auth'
import OverallProgress from '@/components/progress/OverallProgress'
import ChapterProgress from '@/components/progress/ChapterProgress'
import StudyHistory from '@/components/progress/StudyHistory'
import PerformanceStats from '@/components/progress/PerformanceStats'
import Breadcrumb from '@/components/Breadcrumb'
import Navigation from '@/components/navigation/Navigation'

export default async function ProgressPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 全章の情報を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select(`
      id,
      title,
      description,
      order_index,
      slides (id, title, order_index),
      questions (id, question_type)
    `)
    .order('order_index')

  // ユーザーの進捗を取得
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  // ユーザーの回答履歴を取得
  const { data: userAnswers } = await supabase
    .from('user_answers')
    .select(`
      id,
      is_correct,
      answered_at,
      questions (
        id,
        question_text,
        question_type,
        chapter_id,
        slide_id
      )
    `)
    .eq('user_id', user.id)
    .order('answered_at', { ascending: false })

  // 統計情報を計算
  const totalSlides = chapters?.reduce((sum, ch) => sum + (ch.slides?.length || 0), 0) || 0
  const completedSlides = userProgress?.filter(p => p.is_completed).length || 0
  const progressPercentage = totalSlides > 0 ? Math.round((completedSlides / totalSlides) * 100) : 0

  // 章ごとの詳細進捗を計算
  const chapterProgressData = chapters?.map(chapter => {
    const chapterSlideIds = chapter.slides?.map(s => s.id) || []
    const completedInChapter = userProgress?.filter(p => 
      p.is_completed && chapterSlideIds.includes(p.slide_id)
    ).length || 0
    const totalInChapter = chapterSlideIds.length

    // 章の問題に対する回答を取得
    const chapterAnswers = userAnswers?.filter(a =>
      (a.questions as any)?.chapter_id === chapter.id
    ) || []

    const practiceAnswers = chapterAnswers.filter(a =>
      (a.questions as any)?.question_type === 'slide_practice'
    )
    const testAnswers = chapterAnswers.filter(a =>
      (a.questions as any)?.question_type === 'chapter_test'
    )

    // 最新のテストスコアを計算
    const latestTestDate = testAnswers.length > 0 
      ? new Date(Math.max(...testAnswers.map(a => new Date(a.answered_at).getTime())))
      : null
    
    const latestTestAnswers = latestTestDate
      ? testAnswers.filter(a => 
          new Date(a.answered_at).toDateString() === latestTestDate.toDateString()
        )
      : []
    
    const testScore = latestTestAnswers.length > 0
      ? Math.round((latestTestAnswers.filter(a => a.is_correct).length / latestTestAnswers.length) * 100)
      : null
    
    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      totalSlides: totalInChapter,
      completedSlides: completedInChapter,
      progressPercentage: totalInChapter > 0 
        ? Math.round((completedInChapter / totalInChapter) * 100) 
        : 0,
      practiceQuestions: {
        total: practiceAnswers.length,
        correct: practiceAnswers.filter(a => a.is_correct).length
      },
      testScore: testScore,
      slides: chapter.slides?.map(slide => ({
        id: slide.id,
        title: slide.title,
        isCompleted: userProgress?.some(p => p.slide_id === slide.id && p.is_completed) || false
      })) || []
    }
  }) || []

  // 日別の学習記録を集計
  const studyDays = new Map<string, {
    slidesCompleted: number,
    questionsAnswered: number,
    correctAnswers: number
  }>()

  userProgress?.forEach(progress => {
    if (progress.completed_at) {
      const date = new Date(progress.completed_at).toLocaleDateString('ja-JP')
      const existing = studyDays.get(date) || { slidesCompleted: 0, questionsAnswered: 0, correctAnswers: 0 }
      studyDays.set(date, {
        ...existing,
        slidesCompleted: existing.slidesCompleted + 1
      })
    }
  })

  userAnswers?.forEach(answer => {
    const date = new Date(answer.answered_at).toLocaleDateString('ja-JP')
    const existing = studyDays.get(date) || { slidesCompleted: 0, questionsAnswered: 0, correctAnswers: 0 }
    studyDays.set(date, {
      ...existing,
      questionsAnswered: existing.questionsAnswered + 1,
      correctAnswers: existing.correctAnswers + (answer.is_correct ? 1 : 0)
    })
  })

  const studyHistory = Array.from(studyDays.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30) // 最近30日分

  // パフォーマンス統計を計算
  const totalQuestions = userAnswers?.length || 0
  const correctAnswers = userAnswers?.filter(a => a.is_correct).length || 0
  const overallAccuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0

  // 問題タイプ別の統計
  const practiceStats = {
    total: userAnswers?.filter(a => (a.questions as any)?.question_type === 'slide_practice').length || 0,
    correct: userAnswers?.filter(a => (a.questions as any)?.question_type === 'slide_practice' && a.is_correct).length || 0
  }
  const testStats = {
    total: userAnswers?.filter(a => (a.questions as any)?.question_type === 'chapter_test').length || 0,
    correct: userAnswers?.filter(a => (a.questions as any)?.question_type === 'chapter_test' && a.is_correct).length || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <Navigation currentPage="progress" />

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Breadcrumb items={[{ label: '進捗管理' }]} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            学習進捗
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            あなたの学習状況を詳しく確認できます
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* 全体進捗 */}
          <div className="mb-8">
            <OverallProgress
              progressPercentage={progressPercentage}
              completedSlides={completedSlides}
              totalSlides={totalSlides}
              completedChapters={chapterProgressData.filter(ch => ch.progressPercentage === 100).length}
              totalChapters={chapters?.length || 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* パフォーマンス統計 */}
            <div className="lg:col-span-1">
              <PerformanceStats
                overallAccuracy={overallAccuracy}
                totalQuestions={totalQuestions}
                correctAnswers={correctAnswers}
                practiceStats={practiceStats}
                testStats={testStats}
              />
            </div>

            {/* 学習履歴 */}
            <div className="lg:col-span-2">
              <StudyHistory studyHistory={studyHistory} />
            </div>
          </div>

          {/* 章別進捗 */}
          <div>
            <ChapterProgress chapters={chapterProgressData} />
          </div>
        </div>
      </main>
    </div>
  )
}