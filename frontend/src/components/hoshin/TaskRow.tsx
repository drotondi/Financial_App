import type { InitiativeTask } from '../../api/hoshin'

const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-zinc-100 text-zinc-600',
  in_progress: 'bg-blue-100 text-blue-700',
  complete: 'bg-emerald-100 text-emerald-700',
  blocked: 'bg-rose-100 text-rose-700',
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'No iniciada',
  in_progress: 'En curso',
  complete: 'Completada',
  blocked: 'Bloqueada',
}

interface TaskRowProps {
  task: InitiativeTask
  onEdit: (task: InitiativeTask) => void
  onDelete: (taskId: number) => void
}

export default function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-zinc-50 group">
      {/* Progress circle */}
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#e4e4e7" strokeWidth="3" />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray={`${(task.progress / 100) * 75.4} 75.4`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-zinc-700 rotate-90">
          {Math.round(task.progress)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {task.owner && <span className="text-xs text-zinc-500">{task.owner}</span>}
          {task.due_date && (
            <span className="text-xs text-zinc-400">· {task.due_date}</span>
          )}
        </div>
      </div>

      {/* Status badge */}
      <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-md ${STATUS_COLORS[task.status]}`}>
        {STATUS_LABELS[task.status]}
      </span>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Editar"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Eliminar"
        >
          ×
        </button>
      </div>
    </div>
  )
}
