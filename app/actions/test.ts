'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface TestAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
}

export async function submitChapterTest(
  userId: string,
  chapterId: string,
  answers: TestAnswer[]
) {
  const supabase = await createClient()

  try {
    // 既存の回答をクリア（再受験の場合）
    await supabase
      .from('user_answers')
      .delete()
      .eq('user_id', userId)
      .in('question_id', answers.map(a => a.questionId))

    // 新しい回答を保存
    const answerRecords = answers.map(answer => ({
      user_id: userId,
      question_id: answer.questionId,
      selected_answer: answer.selectedAnswer,
      is_correct: answer.isCorrect,
      answered_at: new Date().toISOString()
    }))

    const { error: insertError } = await supabase
      .from('user_answers')
      .insert(answerRecords)

    if (insertError) {
      throw insertError
    }

    // テスト結果を計算
    const correctCount = answers.filter(a => a.isCorrect).length
    const totalCount = answers.length
    const score = Math.round((correctCount / totalCount) * 100)

    // テスト結果を保存（test_results テーブルがあれば）
    // 現在のスキーマにはないので、将来の拡張用にコメントアウト
    /*
    const { error: resultError } = await supabase
      .from('test_results')
      .insert({
        user_id: userId,
        chapter_id: chapterId,
        score: score,
        correct_answers: correctCount,
        total_questions: totalCount,
        completed_at: new Date().toISOString()
      })
    */

    // キャッシュを更新
    revalidatePath(`/chapters/${chapterId}/test`)

    return {
      success: true,
      score: score,
      correctCount: correctCount,
      totalCount: totalCount,
      submittedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('テスト提出エラー:', error)
    return {
      success: false,
      error: 'テストの提出に失敗しました。もう一度お試しください。'
    }
  }
}