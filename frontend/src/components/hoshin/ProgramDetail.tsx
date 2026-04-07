import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { HoshinProgram, InitiativeTask } from '../../api/hoshin'
import { hoshinApi } from '../../api/hoshin'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import TaskRow from './TaskRow'
import TaskForm from './TaskForm'

interface ProgramDetailProps {
  program: HoshinProgram
}

export default function ProgramDetail({ program }: ProgramDetailProps) {
  const qc = useQueryClient()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<InitiativeTask | null>(null)

  const createTask = useMutation({
    mutationFn: (data: Parameters<typeof hoshinApi.createTask>[1]) =>
      hoshinApi.createTask(program.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
      setShowTaskForm(false)
    },
  })

  const updateTask = useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: Parameters<typeof hoshinApi.updateTask>[2] }) =>
      hoshinApi.updateTask(program.id, taskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
      setEditingTask(null)
    },
  })

  const deleteTask = useMutation({
    mutationFn: (taskId: number) => hoshinApi.deleteTask(program.id, taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
    },
  })

  const STATUS_LABELS: Record<string, string> = {
    not_started: 'No iniciado',
    in_progress: 'En curso',
    complete: 'Completado',
    on_hold: 'En pausa',
  }

  const STATUS_COLORS: Record<string, string> = {
    not_started: 'bg-zinc-100 text-zinc-600',
    in_progress: 'bg-blue-100 text-blue-700',
    complete: 'bg-emerald-100 text-emerald-700',
    on_hold: 'bg-amber-100 text-amber-700',
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-5">
      {/* Program header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-base font-semibold text-zinc-900">{program.title}</h2>
          <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[program.status]}`}>
            {STATUS_LABELS[program.status]}
          </span>
        </div>
        {program.description && (
          <p className="text-sm text-zinc-500 mb-3">{program.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
          {program.owner && <span>👤 {program.owner}</span>}
          {program.start_date && <span>📅 {program.start_date}</span>}
          {program.end_date && <span>🏁 {program.end_date}</span>}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Avance del programa</span>
          <span className="font-medium">{Math.round(program.progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${program.progress}%` }}
          />
        </div>
      </div>

      {/* Tasks section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-800">
            Tareas
            {program.tasks.length > 0 && (
              <span className="ml-1.5 text-xs font-normal text-zinc-400">
                ({program.tasks.filter((t) => t.status === 'complete').length}/{program.tasks.length})
              </span>
            )}
          </h3>
          <Button size="sm" onClick={() => setShowTaskForm(true)}>
            + Tarea
          </Button>
        </div>

        {program.tasks.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-6">
            No hay tareas. Agregá la primera.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {program.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={(id) => deleteTask.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create task modal */}
      <Modal open={showTaskForm} onClose={() => setShowTaskForm(false)} title="Nueva tarea">
        <TaskForm
          onSubmit={async (data) => { await createTask.mutateAsync(data as any) }}
          onCancel={() => setShowTaskForm(false)}
        />
      </Modal>

      {/* Edit task modal */}
      <Modal
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
        title="Editar tarea"
      >
        {editingTask && (
          <TaskForm
            initialValues={editingTask}
            onSubmit={async (data) => {
              await updateTask.mutateAsync({ taskId: editingTask.id, data: data as any })
            }}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  )
}
