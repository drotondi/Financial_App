import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AssetsPage from './pages/AssetsPage'
import LiabilitiesPage from './pages/LiabilitiesPage'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'
import HoshinPage from './pages/hoshin/HoshinPage'
import HoshinMatrixPage from './pages/hoshin/HoshinMatrixPage'
import HoshinProgramsPage from './pages/hoshin/HoshinProgramsPage'
import HoshinDashboardPage from './pages/hoshin/HoshinDashboardPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="liabilities" element={<LiabilitiesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="hoshin" element={<HoshinPage />}>
            <Route index element={<Navigate to="matrix" replace />} />
            <Route path="matrix" element={<HoshinMatrixPage />} />
            <Route path="programs" element={<HoshinProgramsPage />} />
            <Route path="dashboard" element={<HoshinDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
