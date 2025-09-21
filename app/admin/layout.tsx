import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/actions/auth'
import { 
  Squares2X2Icon,
  BookOpenIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  // 一時的にコメントアウト - 開発用
  // const { data: profile } = await supabase
  //   .from('users_profile')
  //   .select('is_admin')
  //   .eq('id', user.id)
  //   .single()

  // if (!profile?.is_admin) {
  //   redirect('/dashboard')
  // }

  const navigation = [
    { name: 'ダッシュボード', href: '/admin', icon: Squares2X2Icon },
    { name: '章管理', href: '/admin/chapters', icon: BookOpenIcon },
    { name: 'スライド管理', href: '/admin/slides', icon: DocumentTextIcon },
    { name: '問題管理', href: '/admin/questions', icon: QuestionMarkCircleIcon },
    { name: 'ユーザー管理', href: '/admin/users', icon: UsersIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              管理画面
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <div className="flex-auto">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <HomeIcon className="h-4 w-4" />
                      ユーザー画面に戻る
                    </Link>
                  </div>
                  <form action={signout}>
                    <button
                      type="submit"
                      className="rounded-md bg-gray-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-500"
                    >
                      ログアウト
                    </button>
                  </form>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="pl-72">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  )
}