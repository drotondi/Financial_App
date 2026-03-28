import { api } from './client'
import type { ExchangeRate } from '../store/currencyStore'

export const exchangeRatesApi = {
  list: () => api.get<ExchangeRate[]>('/exchange-rates').then((r) => r.data),

  create: (data: { from_currency: string; to_currency: string; rate: number; label?: string }) =>
    api.post<ExchangeRate>('/exchange-rates', data).then((r) => r.data),

  update: (id: number, data: { rate: number; label?: string }) =>
    api.put<ExchangeRate>(`/exchange-rates/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/exchange-rates/${id}`),
}
