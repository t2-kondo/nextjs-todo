'use client';

import { Todo } from './TodoList';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        todo.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-blue-200 hover:border-blue-300'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
      />
      <span
        className={`flex-1 text-lg ${
          todo.completed
            ? 'line-through text-gray-400'
            : 'text-gray-800'
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Delete todo"
      >
        🗑️ Delete
      </button>
    </div>
  );
}
