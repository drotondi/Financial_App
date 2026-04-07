import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoshinApi } from '../../api/hoshin'
import type { HoshinProgram } from '../../api/hoshin'
import ProgramCard from '../../components/hoshin/ProgramCard'
import ProgramDetail from '../../components/hoshin/ProgramDetail'
import ElementForm from '../../components/hoshin/ElementForm'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function HoshinProgramsPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingProgram, setEditingProgram] = useState<HoshinProgram | null>(null)

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['hoshin-programs'],
    queryFn: hoshinApi.listPrograms,
  })

  const createProgram = useMutation({
    mutationFn: hoshinApi.createProgram,
    onSuccess: (newProg) => {
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      setShowCreate(false)
      setSelectedId(newProg.id)
    },
  })

  const updateProgram = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hoshinApi.updateProgram(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      setEditingProgram(null)
    },
  })

  const deleteProgram = useMutation({
    mutationFn: hoshinApi.deleteProgram,
    onSuccess: (_, deletedId) => {
      qc.invalidateQueries({ queryKey: ['hoshin-programs'] })
      qc.invalidateQueries({ queryKey: ['hoshin-matrix'] })
      if (selectedId === deletedId) setSelectedId(null)
    },
  })

  const selectedProgram = programs.find((p) => p.id === selectedId) ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Program list */}
      <div className="flex-shrink-0 w-72 flex flex-col gap-3">
        <Button onClick={() => setShowCreate(true)}>+ Nuevo Programa</Button>

        {programs.length === 0 ? (
          <EmptyState
            title="Sin programas"
            description="Creá el primer programa para empezar a hacer seguimiento."
          />
        ) : (
          programs.map((prog) => (
            <div key={prog.id} className="group relative">
              <ProgramCard
                program={prog}
                selected={selectedId === prog.id}
                onClick={() => setSelectedId(prog.id === selectedId ? null : prog.id)}
              />
              {/* edit / delete overlay */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingProgram(prog) }}
                  className="p-1 rounded bg-white border border-zinc-200 text-xs text-zinc-500 hover:text-indigo-600 shadow-sm"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteProgram.mutate(prog.id) }}
                  className="p-1 rounded bg-white border border-zinc-200 text-xs text-zinc-500 hover:text-rose-600 shadow-sm"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Program detail */}
      <div className="flex-1 min-w-0">
        {selectedProgram ? (
          <ProgramDetail program={selectedProgram} />
        ) : (
          <div className="flex items-center justify-center py-24 text-sm text-zinc-400">
            Seleccioná un programa para ver su detalle y tareas
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo Programa">
        <ElementForm
          type="program"
          onSubmit={async (data) => { await createProgram.mutateAsync(data as any) }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editingProgram !== null}
        onClose={() => setEditingProgram(null)}
        title="Editar Programa"
      >
        {editingProgram && (
          <ElementForm
            type="program"
            initialValues={editingProgram as any}
            onSubmit={async (data) => {
              await updateProgram.mutateAsync({ id: editingProgram.id, data })
            }}
            onCancel={() => setEditingProgram(null)}
          />
        )}
      </Modal>
    </div>
  )
}
