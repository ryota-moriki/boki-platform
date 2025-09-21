'use client'

interface PerformanceStatsProps {
  overallAccuracy: number
  totalQuestions: number
  correctAnswers: number
  practiceStats: {
    total: number
    correct: number
  }
  testStats: {
    total: number
    correct: number
  }
}

export default function PerformanceStats({
  overallAccuracy,
  totalQuestions,
  correctAnswers,
  practiceStats,
  testStats
}: PerformanceStatsProps) {
  const practiceAccuracy = practiceStats.total > 0 
    ? Math.round((practiceStats.correct / practiceStats.total) * 100) 
    : 0
  const testAccuracy = testStats.total > 0 
    ? Math.round((testStats.correct / testStats.total) * 100) 
    : 0

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600'
    if (accuracy >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 90) return '素晴らしい！'
    if (accuracy >= 80) return '優秀'
    if (accuracy >= 70) return '良好'
    if (accuracy >= 60) return '標準'
    return '要復習'
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">パフォーマンス統計</h2>
      
      {/* 全体正答率 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">全体正答率</span>
          <span className="text-sm text-gray-500">{getAccuracyMessage(overallAccuracy)}</span>
        </div>
        <div className="flex items-baseline">
          <span className={`text-4xl font-bold ${getAccuracyColor(overallAccuracy)}`}>
            {overallAccuracy}
          </span>
          <span className="text-xl font-semibold text-gray-600 ml-1">%</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {correctAnswers} / {totalQuestions} 問正解
        </div>
      </div>

      {/* 問題タイプ別統計 */}
      <div className="space-y-4">
        {/* 練習問題 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900">練習問題</span>
            <span className={`text-lg font-bold ${getAccuracyColor(practiceAccuracy)}`}>
              {practiceAccuracy}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${practiceAccuracy}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-blue-700">
            {practiceStats.correct} / {practiceStats.total} 問正解
          </div>
        </div>

        {/* 確認テスト */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-900">確認テスト</span>
            <span className={`text-lg font-bold ${getAccuracyColor(testAccuracy)}`}>
              {testAccuracy}%
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${testAccuracy}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-green-700">
            {testStats.correct} / {testStats.total} 問正解
          </div>
        </div>
      </div>

      {/* アドバイス */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">学習アドバイス</h3>
        <div className="text-xs text-gray-600 space-y-1">
          {overallAccuracy < 60 && (
            <p>• 基礎をもう一度復習しましょう</p>
          )}
          {practiceAccuracy < testAccuracy && (
            <p>• 練習問題をもっと解いて基礎を固めましょう</p>
          )}
          {testAccuracy < practiceAccuracy - 20 && (
            <p>• テスト形式の問題に慣れる必要があります</p>
          )}
          {overallAccuracy >= 80 && (
            <p>• 素晴らしい成績です！この調子で頑張りましょう</p>
          )}
          {totalQuestions < 50 && (
            <p>• もっと多くの問題を解いて実力を確認しましょう</p>
          )}
        </div>
      </div>
    </div>
  )
}