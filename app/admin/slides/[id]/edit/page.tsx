import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function updateSlide(id: string, formData: FormData) {
  'use server'

  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const chapterId = formData.get('chapterId') as string
  const orderIndex = parseInt(formData.get('orderIndex') as string) || 1

  const { error } = await supabase
    .from('slides')
    .update({
      title,
      content,
      chapter_id: chapterId,
      order_index: orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating slide:', error)
    return
  }

  revalidatePath('/admin/slides')
  redirect('/admin/slides')
}

async function deleteSlide(id: string) {
  'use server'

  const supabase = await createClient()

  const { error } = await supabase
    .from('slides')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting slide:', error)
    return
  }

  revalidatePath('/admin/slides')
  redirect('/admin/slides')
}

export default async function EditSlide({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check admin permission
  await requireAdmin()

  const { id } = await params
  const supabase = await createClient()

  // スライド情報を取得
  const { data: slide } = await supabase
    .from('slides')
    .select('*')
    .eq('id', id)
    .single()

  if (!slide) {
    notFound()
  }

  // 章一覧を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          スライド編集
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          「{slide.title}」を編集します
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={updateSlide.bind(null, id)} className="space-y-6 p-6">
          <div>
            <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700">
              所属章 <span className="text-red-500">*</span>
            </label>
            <select
              name="chapterId"
              id="chapterId"
              required
              defaultValue={slide.chapter_id}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">章を選択してください</option>
              {chapters?.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              スライドタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={slide.title}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              スライド内容 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 text-xs text-gray-500 mb-2">
              Markdown形式で記述できます。見出し（# ## ###）、リスト（- *）、強調（**太字**）などが使用可能です。
            </div>
            <textarea
              name="content"
              id="content"
              rows={20}
              required
              defaultValue={slide.content || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
            />
          </div>

          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700">
              表示順序
            </label>
            <input
              type="number"
              name="orderIndex"
              id="orderIndex"
              min="1"
              defaultValue={slide.order_index}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-between">
            <form action={deleteSlide.bind(null, id)}>
              <button
                type="submit"
                className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={(e) => {
                  if (!confirm('このスライドを削除してもよろしいですか？')) {
                    e.preventDefault()
                  }
                }}
              >
                削除
              </button>
            </form>

            <div className="flex gap-3">
              <Link
                href="/admin/slides"
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