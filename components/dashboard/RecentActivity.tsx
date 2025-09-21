'use client'

interface RecentActivityProps {
  recentAnswers: any
  chapters: any
}

export default function RecentActivity({ recentAnswers, chapters }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) {
      return 'たった今'
    } else if (hours < 24) {
      return `${hours}時間前`
    } else if (days < 7) {
      return `${days}日前`
    } else {
      return date.toLocaleDateString('ja-JP')
    }
  }

  const getChapterTitle = (chapterId: string) => {
    const chapter = chapters?.find((ch: any) => ch.id === chapterId)
    return chapter?.title || '不明な章'
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の学習活動</h3>
        
        {recentAnswers && recentAnswers.length > 0 ? (
          <div className="space-y-3">
            {recentAnswers.slice(0, 5).map((answer: any) => (
              <div key={answer.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  answer.is_correct ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {answer.is_correct ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">
                    {answer.questions?.question_type === 'chapter_test' ? '確認テスト' : '練習問題'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {getChapterTitle(answer.questions?.chapter_id)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(answer.answered_at)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    answer.is_correct 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {answer.is_correct ? '正解' : '不正解'}
                  </span>
                </div>
              </div>
            ))}
            
            {recentAnswers.length > 5 && (
              <div className="pt-3">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  すべての活動を見る →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">まだ学習活動がありません</p>
            <p className="text-xs text-gray-400 mt-1">問題を解くと、ここに表示されます</p>
          </div>
        )}
      </div>
    </div>
  )
}