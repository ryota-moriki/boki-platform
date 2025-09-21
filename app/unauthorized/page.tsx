import Link from 'next/link'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* アイコン */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
          <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
        </div>

        {/* メッセージ */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          アクセス権限がありません
        </h1>

        <p className="text-gray-600 mb-8">
          このページは管理者のみアクセス可能です。<br />
          権限に関してご不明な点がございましたら、管理者にお問い合わせください。
        </p>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ダッシュボードに戻る
          </Link>

          <Link
            href="/chapters"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            学習を続ける
          </Link>
        </div>

        {/* エラーコード */}
        <div className="mt-12 text-sm text-gray-500">
          エラーコード: 403 - Forbidden
        </div>
      </div>
    </div>
  )
}