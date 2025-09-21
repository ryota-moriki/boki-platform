'use client'

import { useState } from 'react'

interface ChapterData {
  id: string
  title: string
  description: string
  totalSlides: number
  completedSlides: number
  progressPercentage: number
  practiceQuestions: {
    total: number
    correct: number
  }
  testScore: number | null
  slides: {
    id: string
    title: string
    isCompleted: boolean
  }[]
}

interface ChapterProgressProps {
  chapters: ChapterData[]
}

export default function ChapterProgress({ chapters }: ChapterProgressProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">章別詳細進捗</h2>
      
      <div className="space-y-4">
        {chapters.map((chapter) => {
          const practiceAccuracy = chapter.practiceQuestions.total > 0
            ? Math.round((chapter.practiceQuestions.correct / chapter.practiceQuestions.total) * 100)
            : null

          return (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              {/* 章のヘッダー */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {chapter.progressPercentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {chapter.completedSlides}/{chapter.totalSlides} スライド
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedChapter === chapter.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        chapter.progressPercentage === 100
                          ? 'bg-green-500'
                          : chapter.progressPercentage > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${chapter.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="mt-3 flex items-center space-x-6 text-sm">
                  {practiceAccuracy !== null && (
                    <div className="flex items-center">
                      <span className="text-gray-600">練習問題正答率:</span>
                      <span className={`ml-2 font-semibold ${
                        practiceAccuracy >= 80 ? 'text-green-600' : 
                        practiceAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {practiceAccuracy}%
                      </span>
                    </div>
                  )}
                  {chapter.testScore !== null && (
                    <div className="flex items-center">
                      <span className="text-gray-600">確認テスト:</span>
                      <span className={`ml-2 font-semibold ${
                        chapter.testScore >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {chapter.testScore}点
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* 展開時のスライド詳細 */}
              {expandedChapter === chapter.id && (
                <div className="px-6 py-4 bg-white border-t">
                  <h4 className="font-medium text-gray-900 mb-3">スライド一覧</h4>
                  <div className="space-y-2">
                    {chapter.slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                            slide.isCompleted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`text-sm ${
                            slide.isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {slide.title}
                          </span>
                        </div>
                        {slide.isCompleted && (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}