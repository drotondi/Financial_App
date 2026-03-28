import { api } from './client'

export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),

  getMe: () => api.get('/auth/me').then((r) => r.data),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/auth/me/password', data),
}
