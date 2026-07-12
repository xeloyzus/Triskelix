import { Routes, Route } from 'react-router'
import LandingPage from '@/pages/LandingPage'
import ScanPage from '@/pages/ScanPage'
import ScanStatusPage from '@/pages/ScanStatusPage'
import DashboardPage from '@/pages/DashboardPage'
import ReportPage from '@/pages/ReportPage'
import SettingsPage from '@/pages/SettingsPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import RequireAuth from '@/components/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/scan" element={<RequireAuth><ScanPage /></RequireAuth>} />
      <Route path="/scan/:id" element={<RequireAuth><ScanStatusPage /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/report/:id" element={<RequireAuth><ReportPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
    </Routes>
  )
}
