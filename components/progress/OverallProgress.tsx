'use client'

interface OverallProgressProps {
  progressPercentage: number
  completedSlides: number
  totalSlides: number
  completedChapters: number
  totalChapters: number
}

export default function OverallProgress({
  progressPercentage,
  completedSlides,
  totalSlides,
  completedChapters,
  totalChapters
}: OverallProgressProps) {
  // 進捗レベルを計算
  const getProgressLevel = () => {
    if (progressPercentage === 100) return { level: 'マスター', color: 'text-purple-600', bgColor: 'bg-purple-100' }
    if (progressPercentage >= 80) return { level: '上級', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (progressPercentage >= 60) return { level: '中級', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (progressPercentage >= 40) return { level: '初級', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (progressPercentage >= 20) return { level: '入門', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: '初心者', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }

  const progressLevel = getProgressLevel()

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">全体進捗</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-gray-900">{progressPercentage}</span>
            <span className="text-2xl font-semibold text-gray-600 ml-1">%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            全体の学習完了率
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${progressLevel.bgColor}`}>
            <span className={`text-lg font-semibold ${progressLevel.color}`}>
              {progressLevel.level}
            </span>
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{completedSlides}</div>
          <div className="text-xs text-gray-600">完了スライド</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{totalSlides - completedSlides}</div>
          <div className="text-xs text-gray-600">残りスライド</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{completedChapters}</div>
          <div className="text-xs text-gray-600">完了章</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{totalChapters - completedChapters}</div>
          <div className="text-xs text-gray-600">残り章</div>
        </div>
      </div>

      {/* モチベーションメッセージ */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {progressPercentage === 100 && '🎉 すべての学習を完了しました！素晴らしい成果です！'}
          {progressPercentage >= 80 && progressPercentage < 100 && '🔥 もう少しで完了です！最後まで頑張りましょう！'}
          {progressPercentage >= 60 && progressPercentage < 80 && '💪 順調に進んでいます！この調子で続けましょう！'}
          {progressPercentage >= 40 && progressPercentage < 60 && '📚 半分まで来ました！着実に前進しています！'}
          {progressPercentage >= 20 && progressPercentage < 40 && '🌱 良いスタートです！コツコツ続けていきましょう！'}
          {progressPercentage > 0 && progressPercentage < 20 && '🚀 学習を始めました！一歩ずつ進んでいきましょう！'}
          {progressPercentage === 0 && '📖 さあ、学習を始めましょう！新しい知識があなたを待っています！'}
        </p>
      </div>
    </div>
  )
}