'use client'

import { TrashIcon } from '@heroicons/react/24/outline'

interface DeleteButtonProps {
  onDelete: () => void
  confirmMessage: string
}

export default function DeleteButton({ onDelete, confirmMessage }: DeleteButtonProps) {
  const handleClick = () => {
    if (confirm(confirmMessage)) {
      onDelete()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="text-red-600 hover:text-red-900 p-1"
    >
      <TrashIcon className="h-4 w-4" />
      <span className="sr-only">削除</span>
    </button>
  )
}