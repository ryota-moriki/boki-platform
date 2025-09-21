import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'

export default async function AdminDashboard() {
  // Check admin permission
  await requireAdmin()

  const supabase = await createClient()

  // 統計データを取得
  const [
    { count: userCount },
    { count: chapterCount },
    { count: slideCount },
    { count: questionCount },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('users_profile').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('*', { count: 'exact', head: true }),
    supabase.from('slides').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase
      .from('users_profile')
      .select('username, display_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // 最近の学習活動を取得
  const { data: recentActivity } = await supabase
    .from('user_progress')
    .select(`
      completed_at,
      slides (title),
      users_profile (username, display_name)
    `)
    .eq('is_completed', true)
    .order('completed_at', { ascending: false })
    .limit(10)

  const stats = [
    {
      name: 'ユーザー数',
      value: userCount || 0,
      description: '登録済みユーザー',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: '章数',
      value: chapterCount || 0,
      description: '作成済み章',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'スライド数',
      value: slideCount || 0,
      description: '作成済みスライド',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: '問題数',
      value: questionCount || 0,
      description: '作成済み問題',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          管理画面ダッシュボード
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          システム全体の統計情報と最近の活動を確認できます
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <div>
              <div className={`absolute rounded-md ${stat.bgColor} p-3`}>
                <div className={`h-6 w-6 ${stat.color}`}>
                  {/* アイコンは後で追加 */}
                </div>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </div>
            <div className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-gray-600">{stat.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 最近のユーザー登録 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              最近のユーザー登録
            </h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentUsers?.map((user) => (
                  <li key={user.username} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {(user.display_name || user.username).charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user.display_name || user.username}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 最近の学習活動 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              最近の学習活動
            </h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity?.map((activity, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-800">
                            ✓
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {(activity.users_profile as any)?.display_name || (activity.users_profile as any)?.username}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          「{(activity.slides as any)?.title}」を完了
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {new Date(activity.completed_at).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}