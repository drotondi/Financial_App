import { useState } from 'react'
import type { InitiativeTask } from '../../api/hoshin'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface TaskFormProps {
  initialValues?: Partial<InitiativeTask>
  onSubmit: (data: Partial<Omit<InitiativeTask, 'id' | 'program_id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [owner, setOwner] = useState(initialValues?.owner ?? '')
  const [status, setStatus] = useState(initialValues?.status ?? 'not_started')
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? '')
  const [progress, setProgress] = useState(String(initialValues?.progress ?? 0))
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        title,
        description: description || null,
        owner: owner || null,
        status: status as InitiativeTask['status'],
        due_date: dueDate || null,
        progress: parseFloat(progress) || 0,
        notes: notes || null,
      })
    } catch {
      setError('Error al guardar. Verificá los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Tarea</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Responsable</label>
          <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha límite</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="not_started">No iniciada</option>
          <option value="in_progress">En curso</option>
          <option value="complete">Completada</option>
          <option value="blocked">Bloqueada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Progreso: {progress}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-full accent-indigo-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas adicionales"
          rows={2}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Guardar
        </Button>
      </div>
    </form>
  )
}
