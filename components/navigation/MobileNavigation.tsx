'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navigation: NavigationItem[] = [
  { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
  { name: '章一覧', href: '/chapters', icon: BookOpenIcon },
  { name: '進捗管理', href: '/progress', icon: ChartBarIcon },
]

interface MobileNavigationProps {
  signoutAction?: () => void
}

export default function MobileNavigation({ signoutAction }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* モバイルメニューボタン */}
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-controls="mobile-menu"
          aria-expanded="false"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">メニューを開く</span>
          {isOpen ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* モバイルメニューオーバーレイ */}
      {isOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* モバイルメニューパネル */}
      <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out sm:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">メニューを閉じる</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={handleLinkClick}
              >
                <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* ログアウトセクション */}
        {signoutAction && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <form action={signoutAction}>
              <button
                type="submit"
                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                onClick={handleLinkClick}
              >
                <UserCircleIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                ログアウト
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}