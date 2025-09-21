'use client'

interface StudyDay {
  date: string
  slidesCompleted: number
  questionsAnswered: number
  correctAnswers: number
}

interface StudyHistoryProps {
  studyHistory: StudyDay[]
}

export default function StudyHistory({ studyHistory }: StudyHistoryProps) {
  // 最大値を計算（グラフのスケール用）
  const maxSlides = Math.max(...studyHistory.map(d => d.slidesCompleted), 1)
  const maxQuestions = Math.max(...studyHistory.map(d => d.questionsAnswered), 1)

  // 今日の日付
  const today = new Date().toLocaleDateString('ja-JP')

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">学習履歴</h2>
      
      {studyHistory.length > 0 ? (
        <div>
          {/* 最近7日間のグラフ */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">最近7日間の活動</h3>
            <div className="flex items-end space-x-2 h-32">
              {studyHistory.slice(0, 7).reverse().map((day, index) => {
                const slideHeight = (day.slidesCompleted / maxSlides) * 100
                const questionHeight = (day.questionsAnswered / maxQuestions) * 100
                const isToday = day.date === today

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end space-x-1 h-24 w-full">
                      <div className="flex-1 flex flex-col justify-end">
                        <div
                          className={`${isToday ? 'bg-blue-500' : 'bg-blue-300'} rounded-t transition-all duration-300 hover:opacity-80`}
                          style={{ height: `${slideHeight}%`, minHeight: day.slidesCompleted > 0 ? '4px' : '0' }}
                          title={`${day.slidesCompleted}スライド`}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <div
                          className={`${isToday ? 'bg-green-500' : 'bg-green-300'} rounded-t transition-all duration-300 hover:opacity-80`}
                          style={{ height: `${questionHeight}%`, minHeight: day.questionsAnswered > 0 ? '4px' : '0' }}
                          title={`${day.questionsAnswered}問`}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).getDate()}日
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded mr-2" />
                <span className="text-xs text-gray-600">スライド</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded mr-2" />
                <span className="text-xs text-gray-600">問題</span>
              </div>
            </div>
          </div>

          {/* 詳細な履歴リスト */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">詳細履歴</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {studyHistory.map((day, index) => {
                const accuracy = day.questionsAnswered > 0
                  ? Math.round((day.correctAnswers / day.questionsAnswered) * 100)
                  : null

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-3 rounded ${
                      day.date === today ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {day.date}
                        {day.date === today && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">今日</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      {day.slidesCompleted > 0 && (
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">{day.slidesCompleted}</span> スライド
                        </span>
                      )}
                      {day.questionsAnswered > 0 && (
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">{day.questionsAnswered}</span> 問
                        </span>
                      )}
                      {accuracy !== null && (
                        <span className={`font-medium ${
                          accuracy >= 80 ? 'text-green-600' : 
                          accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {accuracy}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">まだ学習履歴がありません</p>
          <p className="text-xs text-gray-400 mt-1">学習を始めると、ここに記録されます</p>
        </div>
      )}
    </div>
  )
}