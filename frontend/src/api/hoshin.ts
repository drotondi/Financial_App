import { api } from './client'

// ── Types ────────────────────────────────────────────────────────────────────

export interface StrategicObjective {
  id: number
  user_id: number
  title: string
  description: string | null
  time_horizon_years: number
  color: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface AnnualObjective {
  id: number
  user_id: number
  title: string
  description: string | null
  year: number
  color: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export type ProgramStatus = 'not_started' | 'in_progress' | 'complete' | 'on_hold'
export type TaskStatus = 'not_started' | 'in_progress' | 'complete' | 'blocked'
export type CorrelationStrength = 'strong' | 'medium' | 'weak'

export interface InitiativeTask {
  id: number
  program_id: number
  user_id: number
  title: string
  description: string | null
  owner: string | null
  status: TaskStatus
  due_date: string | null
  progress: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface HoshinProgram {
  id: number
  user_id: number
  title: string
  description: string | null
  owner: string | null
  start_date: string | null
  end_date: string | null
  status: ProgramStatus
  progress: number
  order_index: number
  tasks: InitiativeTask[]
  created_at: string
  updated_at: string
}

export interface HoshinKPI {
  id: number
  user_id: number
  title: string
  description: string | null
  unit: string | null
  target_value: number | null
  current_value: number | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Correlation {
  id: number
  user_id: number
  element_a_type: string
  element_a_id: number
  element_b_type: string
  element_b_id: number
  strength: CorrelationStrength
  created_at: string
}

export interface HoshinMatrix {
  strategic_objectives: StrategicObjective[]
  annual_objectives: AnnualObjective[]
  programs: HoshinProgram[]
  kpis: HoshinKPI[]
  correlations: Correlation[]
}

export interface HoshinDashboard {
  program_status_counts: Record<string, number>
  avg_program_progress: number
  kpi_completion_rate: number
  blocked_task_count: number
  total_tasks: number
  completed_tasks: number
}

// ── API ───────────────────────────────────────────────────────────────────────

export const hoshinApi = {
  // Aggregate
  getMatrix: () => api.get<HoshinMatrix>('/hoshin/matrix').then((r) => r.data),
  getDashboard: () => api.get<HoshinDashboard>('/hoshin/dashboard').then((r) => r.data),

  // Strategic Objectives
  listStrategic: () => api.get<StrategicObjective[]>('/hoshin/strategic-objectives').then((r) => r.data),
  createStrategic: (data: Omit<StrategicObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<StrategicObjective>('/hoshin/strategic-objectives', data).then((r) => r.data),
  updateStrategic: (id: number, data: Partial<Omit<StrategicObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<StrategicObjective>(`/hoshin/strategic-objectives/${id}`, data).then((r) => r.data),
  deleteStrategic: (id: number) => api.delete(`/hoshin/strategic-objectives/${id}`),

  // Annual Objectives
  listAnnual: () => api.get<AnnualObjective[]>('/hoshin/annual-objectives').then((r) => r.data),
  createAnnual: (data: Omit<AnnualObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<AnnualObjective>('/hoshin/annual-objectives', data).then((r) => r.data),
  updateAnnual: (id: number, data: Partial<Omit<AnnualObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<AnnualObjective>(`/hoshin/annual-objectives/${id}`, data).then((r) => r.data),
  deleteAnnual: (id: number) => api.delete(`/hoshin/annual-objectives/${id}`),

  // Programs
  listPrograms: () => api.get<HoshinProgram[]>('/hoshin/programs').then((r) => r.data),
  createProgram: (data: Omit<HoshinProgram, 'id' | 'user_id' | 'tasks' | 'created_at' | 'updated_at'>) =>
    api.post<HoshinProgram>('/hoshin/programs', data).then((r) => r.data),
  updateProgram: (id: number, data: Partial<Omit<HoshinProgram, 'id' | 'user_id' | 'tasks' | 'created_at' | 'updated_at'>>) =>
    api.put<HoshinProgram>(`/hoshin/programs/${id}`, data).then((r) => r.data),
  deleteProgram: (id: number) => api.delete(`/hoshin/programs/${id}`),

  // KPIs
  listKPIs: () => api.get<HoshinKPI[]>('/hoshin/kpis').then((r) => r.data),
  createKPI: (data: Omit<HoshinKPI, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<HoshinKPI>('/hoshin/kpis', data).then((r) => r.data),
  updateKPI: (id: number, data: Partial<Omit<HoshinKPI, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<HoshinKPI>(`/hoshin/kpis/${id}`, data).then((r) => r.data),
  deleteKPI: (id: number) => api.delete(`/hoshin/kpis/${id}`),

  // Correlations
  setCorrelation: (data: {
    element_a_type: string
    element_a_id: number
    element_b_type: string
    element_b_id: number
    strength: CorrelationStrength
  }) => api.post<Correlation>('/hoshin/correlations', data).then((r) => r.data),
  deleteCorrelation: (data: {
    element_a_type: string
    element_a_id: number
    element_b_type: string
    element_b_id: number
  }) => api.delete('/hoshin/correlations', { data }),

  // Tasks
  listTasks: (programId: number) =>
    api.get<InitiativeTask[]>(`/hoshin/programs/${programId}/tasks`).then((r) => r.data),
  createTask: (programId: number, data: Omit<InitiativeTask, 'id' | 'program_id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<InitiativeTask>(`/hoshin/programs/${programId}/tasks`, data).then((r) => r.data),
  updateTask: (programId: number, taskId: number, data: Partial<Omit<InitiativeTask, 'id' | 'program_id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
    api.put<InitiativeTask>(`/hoshin/programs/${programId}/tasks/${taskId}`, data).then((r) => r.data),
  deleteTask: (programId: number, taskId: number) =>
    api.delete(`/hoshin/programs/${programId}/tasks/${taskId}`),
}
