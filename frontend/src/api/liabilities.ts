import { api } from './client'

export interface Liability {
  id: number
  user_id: number
  name: string
  category: string
  currency: string
  outstanding_balance: number
  original_amount: number | null
  interest_rate: number | null
  due_date: string | null
  institution: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export const liabilitiesApi = {
  list: () => api.get<Liability[]>('/liabilities').then((r) => r.data),

  create: (data: Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<Liability>('/liabilities', data).then((r) => r.data),

  update: (id: number, data: Partial<Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<Liability>(`/liabilities/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/liabilities/${id}`),
}
