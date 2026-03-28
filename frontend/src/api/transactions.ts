import { api } from './client'

export interface Transaction {
  id: number
  user_id: number
  asset_id: number | null
  liability_id: number | null
  type: string
  amount: number
  currency: string
  description: string
  category: string | null
  date: string
  created_at: string
}

export const transactionsApi = {
  list: (params?: {
    from_date?: string
    to_date?: string
    type?: string
    category?: string
    asset_id?: number
    page?: number
    page_size?: number
  }) => api.get<Transaction[]>('/transactions', { params }).then((r) => r.data),

  create: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) =>
    api.post<Transaction>('/transactions', data).then((r) => r.data),

  update: (id: number, data: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>) =>
    api.put<Transaction>(`/transactions/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/transactions/${id}`),
}
