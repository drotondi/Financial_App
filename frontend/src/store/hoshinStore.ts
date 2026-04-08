import { create } from 'zustand'

export type ElementType = 'strategic' | 'annual' | 'program' | 'kpi'

interface HoshinUIState {
  selectedProgramId: number | null
  editingElement: { type: ElementType; id: number | null } | null
  highlightedElementType: ElementType | null
  highlightedElementId: number | null

  setSelectedProgram: (id: number | null) => void
  setEditingElement: (el: { type: ElementType; id: number | null } | null) => void
  setHighlight: (type: ElementType, id: number) => void
  clearHighlight: () => void
}

export const useHoshinStore = create<HoshinUIState>((set) => ({
  selectedProgramId: null,
  editingElement: null,
  highlightedElementType: null,
  highlightedElementId: null,

  setSelectedProgram: (id) => set({ selectedProgramId: id }),
  setEditingElement: (el) => set({ editingElement: el }),
  setHighlight: (type, id) => set({ highlightedElementType: type, highlightedElementId: id }),
  clearHighlight: () => set({ highlightedElementType: null, highlightedElementId: null }),
}))
