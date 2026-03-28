import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsApi, type Asset } from '../api/assets'
import AssetTable from '../components/assets/AssetTable'
import AssetForm from '../components/assets/AssetForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ASSET_CATEGORIES } from '../utils/constants'

export default function AssetsPage() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [filterCat, setFilterCat] = useState('')

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsApi.list(),
  })

  const createMut = useMutation({
    mutationFn: assetsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }); qc.invalidateQueries({ queryKey: ['dashboard-allocation'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Asset> }) => assetsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }); qc.invalidateQueries({ queryKey: ['dashboard-allocation'] }); setModalOpen(false); setEditing(null) },
  })

  const deleteMut = useMutation({
    mutationFn: assetsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); qc.invalidateQueries({ queryKey: ['dashboard-summary'] }) },
  })

  const filtered = filterCat ? assets.filter((a) => a.category === filterCat) : assets

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCat('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filterCat ? 'bg-indigo-600 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
          >
            Todos
          </button>
          {ASSET_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === c.value ? 'bg-indigo-600 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>+ Agregar</Button>
      </div>

      <Card className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse h-10 bg-zinc-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <AssetTable
            assets={filtered}
            onEdit={(a) => { setEditing(a); setModalOpen(true) }}
            onDelete={(id) => { if (confirm('¿Eliminar este activo?')) deleteMut.mutate(id) }}
            onAdd={() => { setEditing(null); setModalOpen(true) }}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Editar activo' : 'Agregar activo'}
      >
        <AssetForm
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
