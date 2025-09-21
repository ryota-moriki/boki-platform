'use client'

import { useState } from 'react'

interface Question {
  id: string
  question_text: string
  options: any
  correct_answer: string
  explanation: string
  order_index: number
}

interface Chapter {
  id: string
  title: string
  description: string
}

interface UserAnswer {
  questionId: string
  selectedAnswer: string | null
  flaggedForReview: boolean
}

interface TestResultProps {
  chapter: Chapter
  questions: Question[]
  answers: Map<string, UserAnswer>
  testResult: any
  onReturnToStart: () => void
}

export default function TestResult({ 
  chapter, 
  questions, 
  answers, 
  testResult, 
  onReturnToStart 
}: TestResultProps) {
  const [showExplanations, setShowExplanations] = useState(false)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null)

  const correctAnswers = questions.filter(q => {
    const userAnswer = answers.get(q.id)
    return userAnswer?.selectedAnswer === q.correct_answer
  })

  const score = Math.round((correctAnswers.length / questions.length) * 100)
  const isPassing = score >= 70 // 70%以上で合格とする

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {chapter.title} - テスト結果
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                確認テストが完了しました
              </p>
            </div>
            <button
              onClick={onReturnToStart}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← テスト開始画面に戻る
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* スコア表示 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${
              isPassing ? 'text-green-600' : 'text-red-600'
            }`}>
              {score}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${
              isPassing ? 'text-green-800' : 'text-red-800'
            }`}>
              {isPassing ? '合格' : '不合格'}
            </div>
            <div className="text-gray-600">
              {correctAnswers.length} / {questions.length} 問正解
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-blue-800">総問題数</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers.length}</div>
              <div className="text-sm text-green-800">正解数</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{questions.length - correctAnswers.length}</div>
              <div className="text-sm text-red-800">不正解数</div>
            </div>
          </div>

          {!isPassing && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">復習をお勧めします</h4>
              <p className="text-sm text-yellow-700">
                合格基準（70%）に達していません。間違えた問題を中心に復習し、再度チャレンジしてください。
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {showExplanations ? '解説を隠す' : '解説を見る'}
            </button>
            <button
              onClick={onReturnToStart}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
            >
              もう一度受ける
            </button>
          </div>
        </div>

        {/* 問題別結果 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">問題別結果</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers.get(question.id)
              const isCorrect = userAnswer?.selectedAnswer === question.correct_answer
              const selectedOption = question.options.find((opt: any) => opt.id === userAnswer?.selectedAnswer)
              const correctOption = question.options.find((opt: any) => opt.id === question.correct_answer)

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">問題 {index + 1}</span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? '正解' : '不正解'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{question.question_text}</p>
                  
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">あなたの回答: </span>
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {selectedOption ? `${selectedOption.id.toUpperCase()}. ${selectedOption.text}` : '未回答'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="font-medium">正解: </span>
                        <span className="text-green-600">
                          {correctOption ? `${correctOption.id.toUpperCase()}. ${correctOption.text}` : '不明'}
                        </span>
                      </div>
                    )}
                  </div>

                  {showExplanations && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h5 className="font-medium text-gray-900 mb-2">解説</h5>
                      <p className="text-sm text-gray-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 学習へのリンク */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">次のステップ</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href={`/chapters/${chapter.id}`}
              className="block p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-blue-900 mb-2">章を復習する</h4>
              <p className="text-sm text-blue-700">
                スライドを見直して理解を深めましょう
              </p>
            </a>
            <a
              href="/chapters"
              className="block p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors"
            >
              <h4 className="font-semibold text-green-900 mb-2">他の章へ進む</h4>
              <p className="text-sm text-green-700">
                次の章の学習を始めましょう
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}