import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function updateChapter(id: string, formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const isPublished = formData.get('isPublished') === 'on'
  
  const { error } = await supabase
    .from('chapters')
    .update({
      title,
      description,
      is_published: isPublished,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating chapter:', error)
    return
  }
  
  revalidatePath('/admin/chapters')
  redirect('/admin/chapters')
}

async function deleteChapter(id: string) {
  'use server'
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting chapter:', error)
    return
  }
  
  revalidatePath('/admin/chapters')
  redirect('/admin/chapters')
}

export default async function EditChapter({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check admin permission
  await requireAdmin()

  const { id } = await params
  const supabase = await createClient()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single()

  if (!chapter) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          章編集
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          「{chapter.title}」を編集します
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={updateChapter.bind(null, id)} className="space-y-6 p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              章タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={chapter.title}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              defaultValue={chapter.description || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              defaultChecked={chapter.is_published}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              この章を公開する
            </label>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              disabled
              className="rounded-md border border-red-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
              title="削除機能は未実装です"
            >
              削除
            </button>
            
            <div className="flex gap-3">
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
                更新
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}