import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Shield, Terminal, Clock, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import SecurityScore from '@/components/SecurityScore'
import { SEVERITY_COLORS } from '@/types'
import type { Scan } from '@/types'
import { useStore } from '@/store'
import { api } from '@/api/client'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useStore()
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getScans()
      .then((res) => setScans(res.scans))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const totalVulns = scans.reduce((acc, s) => acc + s.critical_count + s.high_count + s.medium_count + s.low_count, 0)
  const avgScore = scans.length > 0
    ? Math.round(scans.reduce((acc, s) => acc + (s.security_score || 0), 0) / scans.length)
    : 0

  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="font-sans text-3xl md:text-4xl font-normal text-tk-text mb-2">
                Dashboard
              </h1>
              <p className="font-sans text-sm text-tk-text-secondary">
                Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/scan')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-tk-accent text-tk-bg font-mono text-xs uppercase tracking-widest hover:brightness-110 transition-all self-start"
            >
              <Terminal className="w-4 h-4" />
              New Scan
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-tk-accent" />
                <span className="font-mono text-xs text-tk-muted uppercase tracking-wider">Avg Score</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="font-mono text-4xl font-bold" style={{ color: avgScore >= 70 ? '#00ff88' : avgScore >= 40 ? '#ffcc00' : '#ff3c3c' }}>
                  {avgScore}
                </span>
                <span className="font-mono text-xs text-tk-muted mb-1">/100</span>
              </div>
            </div>
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-tk-yellow" />
                <span className="font-mono text-xs text-tk-muted uppercase tracking-wider">Total Vulns</span>
              </div>
              <span className="font-mono text-4xl font-bold text-tk-text">{totalVulns}</span>
            </div>
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted uppercase tracking-wider">Scans</span>
              </div>
              <span className="font-mono text-4xl font-bold text-tk-text">{scans.length}</span>
            </div>
          </div>

          {/* Scan History */}
          <div className="mb-8">
            <h2 className="font-sans text-xl text-tk-text mb-6">Scan History</h2>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-tk-accent animate-spin" />
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-16 bg-tk-surface border border-tk-border border-dashed">
                <Terminal className="w-8 h-8 text-tk-muted mx-auto mb-4" />
                <p className="font-sans text-sm text-tk-muted mb-4">No scans yet</p>
                <button
                  onClick={() => navigate('/scan')}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-tk-accent text-tk-accent font-mono text-xs uppercase hover:bg-tk-accent/10 transition-colors"
                >
                  Run your first scan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => navigate(`/scan/${scan.id}`)}
                    className="w-full flex items-center gap-4 p-4 bg-tk-surface border border-tk-border hover:border-tk-accent transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      <SecurityScore score={scan.security_score || 0} size={64} animated={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs uppercase tracking-wider text-tk-muted">
                          {scan.input_type}
                        </span>
                        {scan.input_value && (
                          <span className="font-mono text-xs text-tk-muted truncate max-w-[200px]">
                            {scan.input_value}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {scan.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-tk-bg border border-tk-border font-mono text-xs text-tk-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs" style={{ color: SEVERITY_COLORS.CRITICAL }}>
                          {scan.critical_count} Critical
                        </span>
                        <span className="font-mono text-xs" style={{ color: SEVERITY_COLORS.HIGH }}>
                          {scan.high_count} High
                        </span>
                        <span className="font-mono text-xs" style={{ color: SEVERITY_COLORS.MEDIUM }}>
                          {scan.medium_count} Medium
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <span className="font-mono text-xs text-tk-muted">{formatDate(scan.created_at)}</span>
                      <ChevronRight className="w-4 h-4 text-tk-muted" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
