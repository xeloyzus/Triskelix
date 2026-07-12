import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { FileCode, Copy, Check, AlertCircle, ArrowLeft, Loader2, Shield, Layers, Map, FileText, Wand2, GitPullRequest } from 'lucide-react'
import Navbar from '@/components/Navbar'
import SecurityScore from '@/components/SecurityScore'
import VulnerabilityList from '@/components/VulnerabilityList'
import TrustMapViewer from '@/components/TrustMapViewer'
import ComposedPathCard from '@/components/ComposedPathCard'
import AttestationExport from '@/components/AttestationExport'
import { SEVERITY_COLORS } from '@/types'
import type { ScanWithVulns, Vulnerability, ComposedPath } from '@/types'
import { api } from '@/api/client'

const STATUS_STEPS = ['pending', 'ingesting', 'analysing', 'reporting', 'complete'] as const

function StatusStep({ label, status, currentStatus }: { label: string; status: string; currentStatus: string }) {
  const stepIndex = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number])
  const currentIndex = STATUS_STEPS.indexOf(currentStatus as typeof STATUS_STEPS[number])
  const isComplete = currentStatus === 'complete' ? stepIndex <= currentIndex : stepIndex < currentIndex
  const isActive = stepIndex === currentIndex
  const isFailed = currentStatus === 'failed'

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 flex items-center justify-center border transition-all ${
        isComplete ? 'bg-tk-green border-tk-green text-tk-bg'
          : isActive ? 'bg-tk-accent border-tk-accent text-tk-bg'
          : isFailed ? 'bg-tk-accent border-tk-accent text-tk-bg'
          : 'border-tk-border text-tk-muted'
      }`}>
        {isComplete ? <Check className="w-4 h-4" />
          : isActive ? <Loader2 className="w-4 h-4 animate-spin" />
          : <span className="font-mono text-xs">{stepIndex + 1}</span>}
      </div>
      <span className={`font-mono text-xs uppercase tracking-wider ${
        isComplete ? 'text-tk-green' : isActive ? 'text-tk-accent' : 'text-tk-muted'
      }`}>{label}</span>
    </div>
  )
}

export default function ScanStatusPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [scan, setScan] = useState<ScanWithVulns | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [remediationBusy, setRemediationBusy] = useState(false)
  const [remediationMessage, setRemediationMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'findings' | 'trustmap' | 'attestation'>('findings')
  const [surfaceFilter, setSurfaceFilter] = useState<'all' | 'code' | 'agent'>('all')

  const fetchScan = async () => {
    if (!id) return
    try {
      const data = await api.getScan(id)
      setScan(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scan results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Poll while the scan is still in progress; re-derived whenever the status
  // changes so it actually stops once the scan reaches complete/failed.
  useEffect(() => {
    if (!scan || scan.status === 'complete' || scan.status === 'failed') return
    const interval = setInterval(fetchScan, 2000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan?.status, id])

  useEffect(() => {
    if (!scan || !['queued', 'generating'].includes(scan.remediation_status)) return
    const interval = setInterval(fetchScan, 3000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan?.remediation_status, id])

  const handleCopyPrompts = () => {
    if (!scan?.vulnerabilities) return
    const prompts = scan.vulnerabilities
      .filter((v: Vulnerability) => v.cursor_prompt)
      .map((v: Vulnerability) => `[${v.severity}] ${v.title}\n${v.cursor_prompt}`)
      .join('\n\n---\n\n')
    navigator.clipboard.writeText(prompts)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateFixes = async () => {
    if (!scan) return
    setRemediationBusy(true)
    setRemediationMessage('')
    try {
      const result = await api.queueRemediation(scan.id)
      setRemediationMessage(`Queued ${result.queued_count} high-impact fix${result.queued_count === 1 ? '' : 'es'}.`)
      await fetchScan()
    } catch (err) {
      setRemediationMessage(err instanceof Error ? err.message : 'Failed to queue remediation.')
    } finally {
      setRemediationBusy(false)
    }
  }

  const handleCreatePr = async () => {
    if (!scan) return
    setRemediationBusy(true)
    setRemediationMessage('')
    try {
      const result = await api.createRemediationPr(scan.id)
      setRemediationMessage(`Created review PR: ${result.pr_url}`)
      await fetchScan()
    } catch (err) {
      setRemediationMessage(err instanceof Error ? err.message : 'Failed to create remediation PR.')
    } finally {
      setRemediationBusy(false)
    }
  }

  const codeVulns = scan?.vulnerabilities?.filter(v => v.surface === 'code') || []
  const agentVulns = scan?.vulnerabilities?.filter(v => v.surface === 'agent') || []

  if (loading) {
    return (
      <div className="min-h-screen bg-tk-bg">
        <Navbar />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-tk-accent animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-tk-muted">Loading scan results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tk-bg">
        <Navbar />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-tk-accent mx-auto mb-4" />
            <p className="font-mono text-sm text-tk-accent mb-4">{error}</p>
            <button onClick={() => navigate('/scan')} className="inline-flex items-center gap-2 px-4 py-2 border border-tk-border text-tk-text font-mono text-xs uppercase hover:border-tk-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> New Scan
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!scan) return null

  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-tk-muted hover:text-tk-text transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs">Back</span>
            </button>
          </div>

          {/* Status Steps */}
          <div className="flex flex-wrap items-center gap-6 mb-12 p-6 bg-tk-surface border border-tk-border">
            <StatusStep label="Ingesting" status="ingesting" currentStatus={scan.status} />
            <div className="hidden sm:block w-8 h-px bg-tk-border" />
            <StatusStep label="Analysing" status="analysing" currentStatus={scan.status} />
            <div className="hidden sm:block w-8 h-px bg-tk-border" />
            <StatusStep label="Reporting" status="reporting" currentStatus={scan.status} />
            <div className="hidden sm:block w-8 h-px bg-tk-border" />
            <StatusStep label="Complete" status="complete" currentStatus={scan.status} />
          </div>

          {scan.status !== 'complete' && scan.status !== 'failed' && (
            <div className="mb-12">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-tk-muted">Progress</span>
                <span className="font-mono text-xs text-tk-accent">{scan.progress_percent}%</span>
              </div>
              <div className="h-2 bg-tk-surface border border-tk-border">
                <div
                  className="h-full bg-tk-accent transition-all duration-500"
                  style={{ width: `${scan.progress_percent}%` }}
                />
              </div>
            </div>
          )}

          {scan.status === 'failed' && (
            <div className="flex items-start gap-3 mb-12 p-6 bg-tk-accent/10 border border-tk-accent/30">
              <AlertCircle className="w-5 h-5 text-tk-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm text-tk-accent mb-1">Scan failed</p>
                <p className="font-mono text-xs text-tk-muted">{scan.error_message || 'An unexpected error occurred.'}</p>
              </div>
            </div>
          )}

          {scan.status === 'complete' && (
            <>
              {/* Score & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-tk-surface border border-tk-border">
                  <SecurityScore score={scan.security_score || 0} />
                  {agentVulns.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-tk-accent/10 border border-tk-accent/30">
                      <Layers className="w-3.5 h-3.5 text-tk-accent" />
                      <span className="font-mono text-xs text-tk-accent">
                        {agentVulns.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length} agent risks found
                      </span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 p-8 bg-tk-surface border border-tk-border">
                  <h2 className="font-sans text-xl text-tk-text mb-6">Scan Summary</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                      <div key={sev} className="text-center p-4 bg-tk-bg border border-tk-border">
                        <div className="font-mono text-2xl font-bold mb-1" style={{ color: SEVERITY_COLORS[sev] }}>
                          {sev === 'CRITICAL' ? scan.critical_count :
                           sev === 'HIGH' ? scan.high_count :
                           sev === 'MEDIUM' ? scan.medium_count : scan.low_count}
                        </div>
                        <div className="font-mono text-xs text-tk-muted uppercase">{sev}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-4 border-t border-tk-border/50">
                    {[
                      ['Files', scan.file_count?.toLocaleString() || '0'],
                      ['Chunks', scan.indexed_chunk_count.toLocaleString()],
                      ['AI reviewed', scan.ai_analyzed_chunk_count.toLocaleString()],
                      ['Static hits', scan.static_finding_count.toLocaleString()],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0 bg-tk-bg border border-tk-border px-3 py-2">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-tk-muted truncate">{label}</div>
                        <div className="font-mono text-sm text-tk-text truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-tk-muted">
                    <span className="font-mono text-xs">{scan.total_lines?.toLocaleString()} lines</span>
                    <span className="font-mono text-xs">{codeVulns.length} code findings</span>
                    <span className="font-mono text-xs text-tk-accent">{agentVulns.length} agent findings</span>
                  </div>
                </div>
              </div>

              {/* Composed Paths — shown at top */}
              {scan.composed_paths && scan.composed_paths.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-tk-accent" />
                    <h2 className="font-sans text-xl text-tk-text">Composed Exploit Paths</h2>
                    <span className="font-mono text-xs text-tk-muted">
                      {scan.composed_paths.length} chain{scan.composed_paths.length > 1 ? 's' : ''} found
                    </span>
                  </div>
                  <div className="space-y-4">
                    {scan.composed_paths.map((path: ComposedPath) => (
                      <ComposedPathCard key={path.id} path={path} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="mb-12 p-6 bg-tk-surface border border-tk-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-xl text-tk-text mb-2">Remediation</h2>
                    <p className="font-sans text-sm text-tk-text-secondary">
                      Generate reviewable fixes after the scan completes. GitHub scans can open a review PR with the generated guidance.
                    </p>
                    <p className="mt-2 font-mono text-xs text-tk-muted">
                      Status: <span className="text-tk-accent">{scan.remediation_status.replace('_', ' ')}</span>
                    </p>
                    {scan.remediation_error && (
                      <p className="mt-2 font-mono text-xs text-tk-accent">{scan.remediation_error}</p>
                    )}
                    {scan.remediation_pr_url && (
                      <a
                        href={scan.remediation_pr_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block font-mono text-xs text-tk-green hover:underline"
                      >
                        Open remediation PR
                      </a>
                    )}
                    {remediationMessage && (
                      <p className="mt-2 font-mono text-xs text-tk-muted">{remediationMessage}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleGenerateFixes}
                      disabled={remediationBusy || ['queued', 'generating'].includes(scan.remediation_status)}
                      className="flex items-center gap-2 px-4 py-2 border border-tk-accent/30 text-tk-accent font-mono text-xs uppercase hover:bg-tk-accent/10 transition-colors disabled:opacity-50"
                    >
                      {remediationBusy || ['queued', 'generating'].includes(scan.remediation_status)
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Wand2 className="w-3.5 h-3.5" />}
                      Generate Fixes
                    </button>
                    {scan.input_type === 'github' && (
                      <button
                        onClick={handleCreatePr}
                        disabled={remediationBusy || scan.remediation_status === 'not_requested' || ['queued', 'generating'].includes(scan.remediation_status)}
                        className="flex items-center gap-2 px-4 py-2 border border-tk-green/30 text-tk-green font-mono text-xs uppercase hover:bg-tk-green/10 transition-colors disabled:opacity-50"
                      >
                        <GitPullRequest className="w-3.5 h-3.5" />
                        Create Review PR
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex border-b border-tk-border mb-8">
                <button onClick={() => setActiveTab('findings')}
                  className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                    activeTab === 'findings' ? 'text-tk-accent border-tk-accent' : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
                  }`}>
                  <AlertCircle className="w-4 h-4" />
                  Findings ({scan.vulnerabilities.length})
                </button>
                <button onClick={() => setActiveTab('trustmap')}
                  className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                    activeTab === 'trustmap' ? 'text-tk-accent border-tk-accent' : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
                  }`}>
                  <Map className="w-4 h-4" />
                  Trust Map
                </button>
                {scan.attestation && (
                  <button onClick={() => setActiveTab('attestation')}
                    className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                      activeTab === 'attestation' ? 'text-tk-accent border-tk-accent' : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
                    }`}>
                    <FileText className="w-4 h-4" />
                    Attestation
                  </button>
                )}
              </div>

              {/* Tab: Findings */}
              {activeTab === 'findings' && (
                <>
                  {/* Surface filter */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-xs text-tk-muted uppercase tracking-wider">Surface:</span>
                    {(['all', 'code', 'agent'] as const).map((f) => (
                      <button key={f} onClick={() => setSurfaceFilter(f)}
                        className={`px-3 py-1.5 font-mono text-xs border transition-all ${
                          surfaceFilter === f
                            ? f === 'agent' ? 'bg-tk-accent/20 border-tk-accent text-tk-accent'
                              : f === 'code' ? 'bg-tk-green/20 border-tk-green text-tk-green'
                              : 'bg-tk-surface border-tk-text text-tk-text'
                            : 'border-tk-border text-tk-muted hover:text-tk-text-secondary'
                        }`}>
                        {f === 'all' ? 'All' : f === 'code' ? 'Code' : 'Agent'}
                        {f === 'code' && ` (${codeVulns.length})`}
                        {f === 'agent' && ` (${agentVulns.length})`}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <button onClick={handleCopyPrompts}
                      className="flex items-center gap-2 px-4 py-2 border border-tk-accent/30 text-tk-accent font-mono text-xs uppercase hover:bg-tk-accent/10 transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy All Cursor Prompts'}
                    </button>
                    <button onClick={() => navigate(`/report/${scan.id}`)}
                      className="flex items-center gap-2 px-4 py-2 border border-tk-green/30 text-tk-green font-mono text-xs uppercase hover:bg-tk-green/10 transition-colors">
                      <FileCode className="w-3.5 h-3.5" />
                      View Full Report
                    </button>
                  </div>

                  <VulnerabilityList vulnerabilities={scan.vulnerabilities} surfaceFilter={surfaceFilter} />
                </>
              )}

              {/* Tab: Trust Map */}
              {activeTab === 'trustmap' && scan.trust_map && (
                <TrustMapViewer trustMap={scan.trust_map} />
              )}

              {/* Tab: Attestation */}
              {activeTab === 'attestation' && scan.attestation && (
                <AttestationExport scanId={scan.id} markdownContent={scan.attestation.markdown_content} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
