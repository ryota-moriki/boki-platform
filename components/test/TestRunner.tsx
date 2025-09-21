'use client'

import { useState } from 'react'
import TestResult from './TestResult'
import { submitChapterTest } from '@/app/actions/test'

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

interface TestRunnerProps {
  chapter: Chapter
  questions: Question[]
  userId: string
  onTestComplete: () => void
}

interface UserAnswer {
  questionId: string
  selectedAnswer: string | null
  flaggedForReview: boolean
}

export default function TestRunner({ 
  chapter, 
  questions, 
  userId, 
  onTestComplete 
}: TestRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map())
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers.get(currentQuestion.id)

  const handleAnswerSelect = (answerId: string) => {
    const newAnswers = new Map(answers)
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      selectedAnswer: answerId,
      flaggedForReview: currentAnswer?.flaggedForReview || false
    })
    setAnswers(newAnswers)
  }

  const toggleReviewFlag = () => {
    const newAnswers = new Map(answers)
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      selectedAnswer: currentAnswer?.selectedAnswer || null,
      flaggedForReview: !(currentAnswer?.flaggedForReview || false)
    })
    setAnswers(newAnswers)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const answersArray = Array.from(answers.values()).map(answer => ({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer || '',
        isCorrect: answer.selectedAnswer === questions.find(q => q.id === answer.questionId)?.correct_answer
      }))

      const result = await submitChapterTest(userId, chapter.id, answersArray)
      setTestResult(result)
    } catch (error) {
      console.error('テスト提出エラー:', error)
    } finally {
      setIsSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  const getAnsweredCount = () => {
    return Array.from(answers.values()).filter(a => a.selectedAnswer !== null).length
  }

  const getUnansweredQuestions = () => {
    return questions.filter(q => !answers.get(q.id)?.selectedAnswer)
  }

  if (testResult) {
    return (
      <TestResult
        chapter={chapter}
        questions={questions}
        answers={answers}
        testResult={testResult}
        onReturnToStart={onTestComplete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {chapter.title} - 確認テスト実施中
              </h1>
              <p className="text-sm text-gray-600">
                問題 {currentQuestionIndex + 1} / {questions.length} | 
                回答済み: {getAnsweredCount()}/{questions.length}
              </p>
            </div>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
            >
              テスト提出
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 問題ナビゲーション */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <h3 className="font-semibold mb-4">問題一覧</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((question, index) => {
                  const answer = answers.get(question.id)
                  const isAnswered = answer?.selectedAnswer !== null
                  const isFlagged = answer?.flaggedForReview
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        h-10 w-10 text-sm font-medium rounded flex items-center justify-center transition-all
                        ${index === currentQuestionIndex 
                          ? 'bg-blue-600 text-white' 
                          : isAnswered 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                        ${isFlagged ? 'ring-2 ring-yellow-400' : ''}
                      `}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>回答済み</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>未回答</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded ring-2 ring-yellow-400"></div>
                  <span>要確認</span>
                </div>
              </div>
            </div>
          </div>

          {/* 問題表示エリア */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">問題 {currentQuestionIndex + 1}</h2>
                <button
                  onClick={toggleReviewFlag}
                  className={`
                    px-3 py-1 text-sm rounded transition-colors
                    ${currentAnswer?.flaggedForReview 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {currentAnswer?.flaggedForReview ? '要確認を解除' : '要確認にする'}
                </button>
              </div>

              <p className="text-lg mb-6">{currentQuestion.question_text}</p>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${currentAnswer?.selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
                  </button>
                ))}
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between">
                <button
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className={`
                    px-6 py-2 rounded font-semibold
                    ${currentQuestionIndex === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                    }
                  `}
                >
                  前の問題
                </button>
                
                <button
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`
                    px-6 py-2 rounded font-semibold
                    ${currentQuestionIndex === questions.length - 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  次の問題
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提出確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx">
            <h3 className="text-lg font-bold mb-4">テスト提出確認</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                回答状況: {getAnsweredCount()} / {questions.length} 問
              </p>
              
              {getUnansweredQuestions().length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-1">
                    未回答の問題があります
                  </p>
                  <p className="text-xs text-yellow-700">
                    問題番号: {getUnansweredQuestions().map(q => q.order_index).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6">
              提出後は解答の変更ができません。よろしいですか？
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? '提出中...' : '提出する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}