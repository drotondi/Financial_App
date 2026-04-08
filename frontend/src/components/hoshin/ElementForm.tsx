import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

// Generic form for Strategic Objective, Annual Objective, KPI, Program
// Renders different fields based on `type`

type ElementType = 'strategic' | 'annual' | 'kpi' | 'program'

interface BaseFields {
  title: string
  description: string
}

interface StrategicFields extends BaseFields {
  time_horizon_years: number
  color: string
}

interface AnnualFields extends BaseFields {
  year: number
  color: string
}

interface KPIFields extends BaseFields {
  unit: string
  target_value: string
  current_value: string
}

interface ProgramFields extends BaseFields {
  owner: string
  start_date: string
  end_date: string
  status: string
  progress: string
}

type FieldMap = {
  strategic: StrategicFields
  annual: AnnualFields
  kpi: KPIFields
  program: ProgramFields
}

type InitialValues = Partial<
  StrategicFields & AnnualFields & KPIFields & ProgramFields
>

interface ElementFormProps {
  type: ElementType
  initialValues?: InitialValues
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onCancel: () => void
}

const CURRENT_YEAR = new Date().getFullYear()

export default function ElementForm({ type, initialValues, onSubmit, onCancel }: ElementFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [timeHorizon, setTimeHorizon] = useState(String(initialValues?.time_horizon_years ?? 3))
  const [year, setYear] = useState(String(initialValues?.year ?? CURRENT_YEAR))
  const [color, setColor] = useState(initialValues?.color ?? '')
  const [unit, setUnit] = useState(initialValues?.unit ?? '')
  const [targetValue, setTargetValue] = useState(String(initialValues?.target_value ?? ''))
  const [currentValue, setCurrentValue] = useState(String(initialValues?.current_value ?? ''))
  const [owner, setOwner] = useState(initialValues?.owner ?? '')
  const [startDate, setStartDate] = useState(initialValues?.start_date ?? '')
  const [endDate, setEndDate] = useState(initialValues?.end_date ?? '')
  const [status, setStatus] = useState(initialValues?.status ?? 'not_started')
  const [progress, setProgress] = useState(String(initialValues?.progress ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const base: Record<string, unknown> = { title, description: description || null }
      if (type === 'strategic') {
        base.time_horizon_years = parseInt(timeHorizon)
        base.color = color || null
      } else if (type === 'annual') {
        base.year = parseInt(year)
        base.color = color || null
      } else if (type === 'kpi') {
        base.unit = unit || null
        base.target_value = targetValue ? parseFloat(targetValue) : null
        base.current_value = currentValue ? parseFloat(currentValue) : null
      } else if (type === 'program') {
        base.owner = owner || null
        base.start_date = startDate || null
        base.end_date = endDate || null
        base.status = status
        base.progress = parseFloat(progress) || 0
      }
      await onSubmit(base)
    } catch {
      setError('Error al guardar. Verificá los datos.')
    } finally {
      setLoading(false)
    }
  }

  const LABELS: Record<ElementType, string> = {
    strategic: 'Objetivo Estratégico',
    annual: 'Objetivo Anual',
    kpi: 'KPI / Métrica',
    program: 'Programa / Iniciativa',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {LABELS[type]}
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Título del ${LABELS[type].toLowerCase()}`}
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

      {type === 'strategic' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Horizonte (años)</label>
            <Input
              type="number"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              min={1}
              max={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Color (hex)</label>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#6366f1"
            />
          </div>
        </div>
      )}

      {type === 'annual' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Año</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={2020}
              max={2040}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Color (hex)</label>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#6366f1"
            />
          </div>
        </div>
      )}

      {type === 'kpi' && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Unidad</label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="%, $, und…" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Target</label>
            <Input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Actual</label>
            <Input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="0" />
          </div>
        </div>
      )}

      {type === 'program' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Responsable</label>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Nombre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="not_started">No iniciado</option>
                <option value="in_progress">En curso</option>
                <option value="complete">Completado</option>
                <option value="on_hold">En pausa</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha inicio</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
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
        </>
      )}

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
