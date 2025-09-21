'use client'

import { useState } from 'react'
import Link from 'next/link'
import TestRunner from './TestRunner'
import Breadcrumb from '@/components/Breadcrumb'

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

interface PreviousResult {
  question_id: string
  is_correct: boolean
  created_at: string
}

interface TestStartProps {
  chapter: Chapter
  questions: Question[]
  previousResults: PreviousResult[]
  userId: string
}

export default function TestStart({ 
  chapter, 
  questions, 
  previousResults, 
  userId 
}: TestStartProps) {
  const [testStarted, setTestStarted] = useState(false)

  if (testStarted) {
    return (
      <TestRunner
        chapter={chapter}
        questions={questions}
        userId={userId}
        onTestComplete={() => setTestStarted(false)}
      />
    )
  }

  // 最新のテスト結果を計算
  const latestTestScore = previousResults.length > 0 ? 
    Math.round((previousResults.filter(r => r.is_correct).length / questions.length) * 100) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <Breadcrumb items={[
              { label: '章一覧', href: '/chapters' },
              { label: chapter.title, href: `/chapters/${chapter.id}` },
              { label: '確認テスト' }
            ]} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {chapter.title} - 確認テスト
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                章の理解度を確認するテストです
              </p>
            </div>
            <Link
              href={`/chapters/${chapter.id}`}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← 章に戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              確認テスト
            </h2>
            <p className="text-lg text-gray-600">
              {chapter.title}の学習内容について確認テストを実施します
            </p>
          </div>

          {/* テスト概要 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">テスト概要</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• 問題数: {questions.length}問</li>
                <li>• 形式: 選択式</li>
                <li>• 制限時間: なし</li>
                <li>• 途中保存: 可能</li>
              </ul>
            </div>

            {latestTestScore !== null && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-4">前回の結果</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {latestTestScore}%
                  </div>
                  <div className="text-sm text-green-800">
                    {previousResults.filter(r => r.is_correct).length} / {questions.length} 問正解
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-yellow-800 mb-2">注意事項</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 問題は順番に解答する必要はありません</li>
              <li>• 未回答の問題がある場合は提出前に警告が表示されます</li>
              <li>• 一度提出すると解答の変更はできません</li>
              <li>• 解答後は解説を確認できます</li>
            </ul>
          </div>

          {/* 開始ボタン */}
          <div className="text-center">
            <button
              onClick={() => setTestStarted(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              テストを開始する
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}