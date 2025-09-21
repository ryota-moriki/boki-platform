import Link from 'next/link'
import { signout } from '@/actions/auth'
import MobileNavigation from './MobileNavigation'

interface NavigationProps {
  currentPage?: 'dashboard' | 'chapters' | 'progress'
}

export default function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                日商簿記学習サイト
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                ダッシュボード
              </Link>
              <Link
                href="/chapters"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'chapters'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                章一覧
              </Link>
              <Link
                href="/progress"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                進捗管理
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* デスクトップ用ログアウトボタン */}
            <div className="hidden sm:block">
              <form action={signout}>
                <button
                  type="submit"
                  className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                >
                  ログアウト
                </button>
              </form>
            </div>

            {/* モバイル用ナビゲーション */}
            <MobileNavigation signoutAction={signout} />
          </div>
        </div>
      </div>
    </nav>
  )
}