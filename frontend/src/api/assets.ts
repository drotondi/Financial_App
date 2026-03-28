import { api } from './client'

export interface Asset {
  id: number
  user_id: number
  name: string
  category: string
  currency: string
  current_value: number
  cost_basis: number | null
  quantity: number | null
  institution: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export const assetsApi = {
  list: (params?: { category?: string; currency?: string }) =>
    api.get<Asset[]>('/assets', { params }).then((r) => r.data),

  create: (data: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<Asset>('/assets', data).then((r) => r.data),

  update: (id: number, data: Partial<Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<Asset>(`/assets/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/assets/${id}`),
}
