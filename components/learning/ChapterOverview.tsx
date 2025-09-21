'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

interface Chapter {
  id: string
  title: string
  description: string
}

interface Slide {
  id: string
  title: string
  order_index: number
}

interface ChapterOverviewProps {
  chapter: Chapter
  slides: Slide[]
  userProgress: Map<string, boolean>
  hasChapterTest: boolean
  userId: string
}

export default function ChapterOverview({
  chapter,
  slides,
  userProgress,
  hasChapterTest,
  userId
}: ChapterOverviewProps) {
  const completedSlides = Array.from(userProgress.values()).filter(Boolean).length
  const progressPercentage = slides.length > 0 ? Math.round((completedSlides / slides.length) * 100) : 0
  const allSlidesCompleted = completedSlides === slides.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <Breadcrumb items={[
              { label: '章一覧', href: '/chapters' },
              { label: chapter.title }
            ]} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
            </div>
            <Link
              href="/chapters"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← 章一覧に戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 進捗状況 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">学習進捗</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>完了したスライド</span>
              <span>{completedSlides} / {slides.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-lg font-semibold text-blue-600">
              {progressPercentage}% 完了
            </div>
          </div>
          
          {allSlidesCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                🎉 すべてのスライドを完了しました！確認テストに挑戦できます。
              </p>
            </div>
          )}
        </div>

        {/* アクションカード */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 学習開始 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">スライド学習</h3>
                <p className="text-sm text-gray-600">章の内容をスライドで学習</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {slides.length}個のスライドで構成されています。各スライドには関連する練習問題も含まれています。
            </p>
            <Link
              href={`/chapters/${chapter.id}/learn`}
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {completedSlides > 0 ? '学習を続ける' : '学習を開始する'}
            </Link>
          </div>

          {/* 確認テスト */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full mr-4 ${
                hasChapterTest 
                  ? allSlidesCompleted 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                  : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  hasChapterTest 
                    ? allSlidesCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                    : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">確認テスト</h3>
                <p className="text-sm text-gray-600">章全体の理解度確認</p>
              </div>
            </div>
            
            {!hasChapterTest ? (
              <p className="text-gray-500 mb-4">
                この章には確認テストがまだ準備されていません。
              </p>
            ) : !allSlidesCompleted ? (
              <p className="text-gray-500 mb-4">
                確認テストを受けるには、すべてのスライドを完了してください。
              </p>
            ) : (
              <p className="text-gray-700 mb-4">
                章で学んだ内容の理解度を確認できます。約10問の選択式問題です。
              </p>
            )}
            
            <Link
              href={hasChapterTest && allSlidesCompleted ? `/chapters/${chapter.id}/test` : '#'}
              className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                hasChapterTest && allSlidesCompleted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => {
                if (!hasChapterTest || !allSlidesCompleted) {
                  e.preventDefault()
                }
              }}
            >
              確認テストを受ける
            </Link>
          </div>
        </div>

        {/* スライド一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">スライド一覧</h2>
          <div className="space-y-3">
            {slides.map((slide, index) => {
              const isCompleted = userProgress.get(slide.id) || false
              return (
                <div key={slide.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold ${
                      isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{slide.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isCompleted && (
                      <span className="text-green-600 mr-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}