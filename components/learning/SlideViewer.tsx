'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Slide {
  id: string
  title: string
  content: string
  order_index: number
}

interface Chapter {
  id: string
  title: string
  description: string
}

interface Question {
  id: string
  question_text: string
  options: any
  correct_answer: string
  explanation: string
}

interface SlideViewerProps {
  chapter: Chapter
  slides: Slide[]
  userProgress: Map<string, boolean>
  questionsBySlide: Map<string, Question[]>
  userId: string
}

export default function SlideViewer({
  chapter,
  slides,
  userProgress,
  questionsBySlide,
  userId
}: SlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [questionResults, setQuestionResults] = useState<Map<string, boolean>>(new Map())
  const [showResultsSummary, setShowResultsSummary] = useState(false)
  
  const router = useRouter()
  const currentSlide = slides[currentSlideIndex]
  const currentQuestions = questionsBySlide.get(currentSlide.id) || []
  const currentQuestion = currentQuestions[currentQuestionIndex]
  const isCompleted = userProgress.get(currentSlide.id) || false
  const hasQuestions = currentQuestions.length > 0

  const markSlideAsCompleted = async () => {
    if (isCompleted || isCompleting) return
    
    setIsCompleting(true)
    const supabase = createClient()
    
    // 既存の進捗を確認
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('slide_id', currentSlide.id)
      .single()

    if (existing) {
      // 更新
      await supabase
        .from('user_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      // 新規作成
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          slide_id: currentSlide.id,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
    }
    
    setIsCompleting(false)
    router.refresh()
  }

  const handleNextSlide = async () => {
    // 現在のスライドを完了にする
    if (!isCompleted) {
      await markSlideAsCompleted()
    }
    
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
      resetQuestionState()
    }
  }

  const resetQuestionState = () => {
    setShowQuestion(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowResultsSummary(false)
    setQuestionResults(new Map())
  }

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
      resetQuestionState()
    }
  }

  const handleAnswerSelect = async (answerId: string) => {
    setSelectedAnswer(answerId)
    setShowResult(true)
    
    // 回答を保存
    const supabase = createClient()
    await supabase
      .from('user_answers')
      .insert({
        user_id: userId,
        question_id: currentQuestion.id,
        selected_answer: answerId,
        is_correct: answerId === currentQuestion.correct_answer
      })
    
    // 結果を記録
    const newResults = new Map(questionResults)
    newResults.set(currentQuestion.id, answerId === currentQuestion.correct_answer)
    setQuestionResults(newResults)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // 全問題完了
      setShowResultsSummary(true)
      // スライドを完了にする
      if (!isCompleted) {
        markSlideAsCompleted()
      }
    }
  }

  const handleBackToSlide = () => {
    setShowQuestion(false)
    setShowResultsSummary(false)
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // マークダウンの簡単な処理
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-3 mb-2">{line.substring(4)}</h3>
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>
      }
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        )
      }
      if (line.trim() === '') {
        return <br key={index} />
      }
      return <p key={index} className="mb-2">{line}</p>
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentSlideIndex + 1} / {slides.length} スライド
              </p>
            </div>
            <Link
              href={`/chapters/${chapter.id}`}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← 章概要に戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {!showQuestion ? (
          /* スライド表示 */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentSlide.title}
              </h2>
              {isCompleted && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  完了済み
                </span>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              {formatContent(currentSlide.content)}
            </div>

            {/* 練習問題があれば表示 */}
            {hasQuestions && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  このスライドには練習問題があります（{currentQuestions.length}問）
                </p>
                <button
                  onClick={() => setShowQuestion(true)}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  問題を解く
                </button>
              </div>
            )}
          </div>
        ) : showResultsSummary ? (
          /* 結果サマリー表示 */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">練習問題 結果</h3>
            
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-indigo-600">
                  {currentQuestions.filter(q => questionResults.get(q.id) === true).length} / {currentQuestions.length}
                </div>
                <div className="text-gray-600">正解</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">問題別結果</h4>
                {currentQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between py-2">
                    <span>問題 {index + 1}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      questionResults.get(question.id) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {questionResults.get(question.id) ? '正解' : '不正解'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBackToSlide}
                className="rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-500"
              >
                スライドに戻る
              </button>
              <button
                onClick={() => {
                  setShowQuestion(false)
                  setShowResultsSummary(false)
                  setCurrentQuestionIndex(0)
                  setQuestionResults(new Map())
                }}
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
              >
                もう一度解く
              </button>
            </div>
          </div>
        ) : (
          /* 問題表示 */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">練習問題</h3>
              <div className="text-sm text-gray-500">
                {currentQuestionIndex + 1} / {currentQuestions.length}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-center space-x-2">
                {currentQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600'
                        : index < currentQuestionIndex
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">{currentQuestion?.question_text}</p>
            
            <div className="space-y-3">
              {currentQuestion?.options.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => !showResult && handleAnswerSelect(option.id)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? option.id === currentQuestion.correct_answer
                        ? 'border-green-500 bg-green-50'
                        : option.id === selectedAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : selectedAnswer === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correct_answer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="font-semibold mb-2">
                  {selectedAnswer === currentQuestion.correct_answer ? '正解！' : '不正解'}
                </p>
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBackToSlide}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← スライドに戻る
              </button>
              
              {showResult && (
                <button
                  onClick={handleNextQuestion}
                  className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  {currentQuestionIndex < currentQuestions.length - 1 ? '次の問題' : '結果を見る'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePreviousSlide}
            disabled={currentSlideIndex === 0}
            className={`rounded-md px-6 py-3 text-sm font-semibold shadow-sm ${
              currentSlideIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            ← 前のスライド
          </button>

          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlideIndex(index)
                  setShowQuestion(false)
                  setSelectedAnswer(null)
                  setShowResult(false)
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? 'bg-indigo-600 w-8'
                    : userProgress.get(slides[index].id)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentSlideIndex === slides.length - 1 ? (
            <button
              onClick={async () => {
                // 最終スライドを完了にする
                if (!isCompleted) {
                  await markSlideAsCompleted()
                }
                // 少し待ってから章概要に戻る
                setTimeout(() => {
                  window.location.href = `/chapters/${chapter.id}`
                }, 500)
              }}
              className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              章を完了する
            </button>
          ) : (
            <button
              onClick={handleNextSlide}
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              次のスライド →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}