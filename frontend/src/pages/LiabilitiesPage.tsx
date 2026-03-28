import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { liabilitiesApi, type Liability } from '../api/liabilities'
import LiabilityTable from '../components/liabilities/LiabilityTable'
import LiabilityForm from '../components/liabilities/LiabilityForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function LiabilitiesPage() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Liability | null>(null)

  const { data: liabilities = [], isLoading } = useQuery({
    queryKey: ['liabilities'],
    queryFn: liabilitiesApi.list,
  })

  const createMut = useMutation({
    mutationFn: liabilitiesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['liabilities'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Liability> }) => liabilitiesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['liabilities'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }); setModalOpen(false); setEditing(null) },
  })

  const deleteMut = useMutation({
    mutationFn: liabilitiesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['liabilities'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }) },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>+ Agregar</Button>
      </div>

      <Card className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="animate-pulse h-10 bg-zinc-100 rounded-lg" />)}
          </div>
        ) : (
          <LiabilityTable
            liabilities={liabilities}
            onEdit={(l) => { setEditing(l); setModalOpen(true) }}
            onDelete={(id) => { if (confirm('¿Eliminar este pasivo?')) deleteMut.mutate(id) }}
            onAdd={() => { setEditing(null); setModalOpen(true) }}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Editar pasivo' : 'Agregar pasivo'}
      >
        <LiabilityForm
          initial={editing ?? undefined}
          onSubmit={async (data) => {
            if (editing) {
              await updateMut.mutateAsync({ id: editing.id, data })
            } else {
              await createMut.mutateAsync(data)
            }
          }}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>
    </div>
  )
}
