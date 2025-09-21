import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

async function createSlide(formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const chapterId = formData.get('chapterId') as string
  
  // 指定された章での次の順序番号を取得
  const { data: maxOrder } = await supabase
    .from('slides')
    .select('order_index')
    .eq('chapter_id', chapterId)
    .order('order_index', { ascending: false })
    .limit(1)
  
  const nextOrder = (maxOrder?.[0]?.order_index || 0) + 1
  
  const { error } = await supabase
    .from('slides')
    .insert({
      title,
      content,
      chapter_id: chapterId,
      order_index: nextOrder
    })
  
  if (error) {
    console.error('Error creating slide:', error)
    return
  }
  
  revalidatePath('/admin/slides')
  redirect('/admin/slides')
}

export default async function NewSlide() {
  // Check admin permission
  await requireAdmin()

  const supabase = await createClient()

  // 章の一覧を取得
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title')
    .order('order_index')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          新規スライド作成
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          新しい学習スライドを作成します
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={createSlide} className="space-y-6 p-6">
          <div>
            <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700">
              所属章 <span className="text-red-500">*</span>
            </label>
            <select
              name="chapterId"
              id="chapterId"
              required
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="例：簿記とは何か"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder={`# スライドタイトル

## 見出し

簿記とは、企業の経済活動を記録・計算・整理して、経営成績や財政状態を明らかにする手法です。

## 重要なポイント

- **記録**: 取引を帳簿に記録する
- **計算**: 損益や財政状態を計算する  
- **整理**: わかりやすく整理して報告する

## まとめ

簿記は企業経営にとって重要な...`}
            />
          </div>


          <div className="flex justify-end gap-3">
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
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}