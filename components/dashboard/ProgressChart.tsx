'use client'

interface ChapterProgress {
  id: string
  title: string
  totalSlides: number
  completedSlides: number
  progressPercentage: number
}

interface ProgressChartProps {
  chapterProgress: ChapterProgress[]
}

export default function ProgressChart({ chapterProgress }: ProgressChartProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">章別学習進捗</h3>
        <div className="space-y-4">
          {chapterProgress.map((chapter, index) => (
            <div key={chapter.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {chapter.title}
                </span>
                <span className="text-sm text-gray-500">
                  {chapter.completedSlides}/{chapter.totalSlides} ({chapter.progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    chapter.progressPercentage === 100 
                      ? 'bg-green-500' 
                      : chapter.progressPercentage > 0 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${chapter.progressPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {chapterProgress.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            データがありません
          </div>
        )}
      </div>
    </div>
  )
}