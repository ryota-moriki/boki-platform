import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">日商簿記学習サイト</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    ダッシュボード
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              日商簿記3級を
              <span className="text-indigo-600">マスター</span>しよう
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              効果的な学習システムで、簿記の基礎をしっかり身につけましょう。
              <br />
              スライド学習、練習問題、確認テストで着実にスキルアップ。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  学習を続ける
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    無料で始める
                  </Link>
                  <Link
                    href="/login"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    ログイン <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-indigo-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">体系的な学習</h3>
                <p className="mt-2 text-gray-600">
                  10章構成で基礎から順番に学習。初心者でも安心して進められます。
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-indigo-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">実践的な問題</h3>
                <p className="mt-2 text-gray-600">
                  各章に練習問題と確認テスト。理解度を確認しながら進められます。
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-indigo-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">進捗管理</h3>
                <p className="mt-2 text-gray-600">
                  学習の進み具合を可視化。モチベーションを保ちながら学習できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 日商簿記学習サイト. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
