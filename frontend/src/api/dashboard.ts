import { api } from './client'

export const dashboardApi = {
  summary: (base_currency = 'USD') =>
    api.get('/dashboard/summary', { params: { base_currency } }).then((r) => r.data),

  allocation: (base_currency = 'USD') =>
    api.get('/dashboard/allocation', { params: { base_currency } }).then((r) => r.data),

  trend: (months = 12, base_currency = 'USD') =>
    api.get('/dashboard/trend', { params: { months, base_currency } }).then((r) => r.data),
}
