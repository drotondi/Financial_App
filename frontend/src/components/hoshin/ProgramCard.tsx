import type { HoshinProgram } from '../../api/hoshin'

const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'No iniciado',
  in_progress: 'En curso',
  complete: 'Completado',
  on_hold: 'En pausa',
}

interface ProgramCardProps {
  program: HoshinProgram
  selected?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function ProgramCard({ program, selected, onClick, onEdit, onDelete }: ProgramCardProps) {
  const completedTasks = program.tasks.filter((t) => t.status === 'complete').length
  const totalTasks = program.tasks.length

  return (
    <div
      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
        selected
          ? 'border-indigo-400 bg-indigo-50 shadow-md'
          : 'border-zinc-200 bg-white hover:border-indigo-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 leading-tight">{program.title}</h3>
          {program.owner && <p className="text-xs text-zinc-500 mt-0.5">{program.owner}</p>}
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[program.status]}`}>
          {STATUS_LABELS[program.status]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Avance</span>
          <span>{Math.round(program.progress)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${program.progress}%` }}
          />
        </div>
      </div>

      {/* Tasks count */}
      {totalTasks > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span>✓ {completedTasks}/{totalTasks} tareas</span>
        </div>
      )}

      {/* Dates */}
      {(program.start_date || program.end_date) && (
        <div className="mt-2 text-xs text-zinc-400">
          {program.start_date} {program.start_date && program.end_date && '→'} {program.end_date}
        </div>
      )}

      {/* Edit/Delete actions */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="p-1 rounded text-zinc-400 hover:text-indigo-600 hover:bg-white text-xs"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-white text-xs"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  )
}
