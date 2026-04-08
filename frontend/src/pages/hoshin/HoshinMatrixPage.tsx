import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoshinApi } from '../../api/hoshin'
import type {
  StrategicObjective,
  AnnualObjective,
  HoshinProgram,
  HoshinKPI,
} from '../../api/hoshin'
import XMatrix from '../../components/hoshin/XMatrix'
import ElementForm from '../../components/hoshin/ElementForm'
import Modal from '../../components/ui/Modal'

type ModalState =
  | { mode: 'create'; type: 'strategic' | 'annual' | 'kpi' | 'program' }
  | { mode: 'edit'; type: 'strategic'; obj: StrategicObjective }
  | { mode: 'edit'; type: 'annual'; obj: AnnualObjective }
  | { mode: 'edit'; type: 'program'; obj: HoshinProgram }
  | { mode: 'edit'; type: 'kpi'; obj: HoshinKPI }
  | null

const MODAL_TITLES: Record<string, string> = {
  strategic: 'Objetivo Estratégico',
  annual: 'Objetivo Anual',
  program: 'Programa / Iniciativa',
  kpi: 'KPI / Métrica',
}

export default function HoshinMatrixPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<ModalState>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['hoshin-matrix'],
    queryFn: hoshinApi.getMatrix,
  })

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createStrategic = useMutation({
    mutationFn: hoshinApi.createStrategic,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const updateStrategic = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hoshinApi.updateStrategic(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const deleteStrategic = useMutation({
    mutationFn: hoshinApi.deleteStrategic,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })

  const createAnnual = useMutation({
    mutationFn: hoshinApi.createAnnual,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const updateAnnual = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hoshinApi.updateAnnual(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const deleteAnnual = useMutation({
    mutationFn: hoshinApi.deleteAnnual,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })

  const createProgram = useMutation({
    mutationFn: hoshinApi.createProgram,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const updateProgram = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hoshinApi.updateProgram(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const deleteProgram = useMutation({
    mutationFn: hoshinApi.deleteProgram,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })

  const createKPI = useMutation({
    mutationFn: hoshinApi.createKPI,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const updateKPI = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hoshinApi.updateKPI(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }); setModal(null) },
  })
  const deleteKPI = useMutation({
    mutationFn: hoshinApi.deleteKPI,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })

  // ── Submit handler ─────────────────────────────────────────────────────────

  async function handleSubmit(formData: Record<string, unknown>) {
    if (!modal) return
    if (modal.mode === 'create') {
      if (modal.type === 'strategic') await createStrategic.mutateAsync(formData as any)
      else if (modal.type === 'annual') await createAnnual.mutateAsync(formData as any)
      else if (modal.type === 'program') await createProgram.mutateAsync(formData as any)
      else if (modal.type === 'kpi') await createKPI.mutateAsync(formData as any)
    } else {
      if (modal.type === 'strategic') await updateStrategic.mutateAsync({ id: modal.obj.id, data: formData })
      else if (modal.type === 'annual') await updateAnnual.mutateAsync({ id: modal.obj.id, data: formData })
      else if (modal.type === 'program') await updateProgram.mutateAsync({ id: modal.obj.id, data: formData })
      else if (modal.type === 'kpi') await updateKPI.mutateAsync({ id: modal.obj.id, data: formData })
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        Error al cargar la matriz. Verificá que el backend esté activo.
      </div>
    )
  }

  const modalTitle = modal
    ? `${modal.mode === 'create' ? 'Nuevo' : 'Editar'} ${MODAL_TITLES[modal.type]}`
    : ''

  const initialValues = modal?.mode === 'edit' ? (modal.obj as any) : undefined

  return (
    <>
      <XMatrix
        strategicObjs={data.strategic_objectives}
        annualObjs={data.annual_objectives}
        programs={data.programs}
        kpis={data.kpis}
        correlations={data.correlations}
        onAddStrategic={() => setModal({ mode: 'create', type: 'strategic' })}
        onAddAnnual={() => setModal({ mode: 'create', type: 'annual' })}
        onAddProgram={() => setModal({ mode: 'create', type: 'program' })}
        onAddKPI={() => setModal({ mode: 'create', type: 'kpi' })}
        onEditStrategic={(obj) => setModal({ mode: 'edit', type: 'strategic', obj })}
        onEditAnnual={(obj) => setModal({ mode: 'edit', type: 'annual', obj })}
        onEditProgram={(obj) => setModal({ mode: 'edit', type: 'program', obj })}
        onEditKPI={(obj) => setModal({ mode: 'edit', type: 'kpi', obj })}
        onDeleteStrategic={(id) => deleteStrategic.mutate(id)}
        onDeleteAnnual={(id) => deleteAnnual.mutate(id)}
        onDeleteProgram={(id) => deleteProgram.mutate(id)}
        onDeleteKPI={(id) => deleteKPI.mutate(id)}
      />

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modalTitle}>
        {modal && (
          <ElementForm
            type={modal.type}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  )
}
