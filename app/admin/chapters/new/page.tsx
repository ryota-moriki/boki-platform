import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function createChapter(formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const isPublished = formData.get('isPublished') === 'on'
  
  // 次の順序番号を取得
  const { data: maxOrder } = await supabase
    .from('chapters')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
  
  const nextOrder = (maxOrder?.[0]?.order_index || 0) + 1
  
  const { error } = await supabase
    .from('chapters')
    .insert({
      title,
      description,
      order_index: nextOrder,
      is_published: isPublished
    })
  
  if (error) {
    console.error('Error creating chapter:', error)
    return
  }
  
  revalidatePath('/admin/chapters')
  redirect('/admin/chapters')
}

export default async function NewChapter() {
  // Check admin permission
  await requireAdmin()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          新規章作成
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          新しい学習章を作成します
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={createChapter} className="space-y-6 p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              章タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="例：第1章 簿記の基礎"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              章の説明
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="この章で学ぶ内容の概要を記入してください"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              この章を公開する
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/chapters"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}