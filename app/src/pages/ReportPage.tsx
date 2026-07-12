import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Download, Copy, Check, FileCode, Loader2, AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import SecurityScore from '@/components/SecurityScore'
import { SEVERITY_COLORS } from '@/types'
import type { ScanWithVulns } from '@/types'
import { api } from '@/api/client'

export default function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [scan, setScan] = useState<ScanWithVulns | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'report' | 'action'>('report')

  useEffect(() => {
    if (!id) return
    api
      .getScan(id)
      .then(setScan)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [id])

  const reportContent = scan?.report?.markdown_content ?? ''
  const actionContent = scan?.report?.github_action_yaml ?? ''

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === 'report' ? reportContent : actionContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = activeTab === 'report' ? reportContent : actionContent
    const filename = activeTab === 'report' ? `triskelix-report-${id}.md` : `triskelix-action-${id}.yml`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Parse markdown sections for display
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactElement[] = []
    let inCode = false
    let codeContent = ''
    let key = 0

    const flushCode = () => {
      if (inCode && codeContent) {
        elements.push(
          <pre key={key++} className="bg-tk-bg p-4 border border-tk-border overflow-x-auto my-4">
            <code className="font-mono text-xs text-tk-code leading-relaxed whitespace-pre">
              {codeContent.trim()}
            </code>
          </pre>
        )
        inCode = false
        codeContent = ''
      }
    }

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          flushCode()
        } else {
          inCode = true
          void line
        }
        continue
      }

      if (inCode) {
        codeContent += line + '\n'
        continue
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="font-sans text-3xl text-tk-text mt-8 mb-4">{line.replace('# ', '')}</h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="font-sans text-xl text-tk-text mt-8 mb-4">{line.replace('## ', '')}</h2>
        )
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '')
        const hasSeverity = text.includes('[CRITICAL]') || text.includes('[HIGH]') || text.includes('[MEDIUM]') || text.includes('[LOW]')
        if (hasSeverity) {
          const sev = text.match(/\[(CRITICAL|HIGH|MEDIUM|LOW)\]/)?.[1]
          const color = sev ? SEVERITY_COLORS[sev as keyof typeof SEVERITY_COLORS] : '#f0f0f5'
          elements.push(
            <h3 key={key++} className="font-sans text-lg mt-8 mb-4" style={{ color }}>
              {text}
            </h3>
          )
        } else {
          elements.push(
            <h3 key={key++} className="font-sans text-lg text-tk-text mt-8 mb-4">{text}</h3>
          )
        }
      } else if (line.startsWith('- **')) {
        const text = line.replace('- **', '').replace('**', '').replace('**:', ':')
        elements.push(
          <p key={key++} className="font-mono text-xs text-tk-muted mb-1">{text}</p>
        )
      } else if (line.startsWith('|')) {
        // Skip table separator lines
        if (!line.includes('---')) {
          const cells = line.split('|').filter(c => c.trim())
          elements.push(
            <div key={key++} className="flex gap-4 py-2 border-b border-tk-border/50">
              {cells.map((cell, i) => (
                <span key={i} className="font-mono text-xs text-tk-text-secondary">{cell.trim()}</span>
              ))}
            </div>
          )
        }
      } else if (line.startsWith('---')) {
        elements.push(<hr key={key++} className="border-tk-border my-8" />)
      } else if (line.trim()) {
        elements.push(
          <p key={key++} className="font-sans text-sm text-tk-text-secondary leading-relaxed mb-3">
            {line.replace(/\*\*/g, '').replace(/`/g, '')}
          </p>
        )
      }
    }

    flushCode()
    return elements
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tk-bg">
        <Navbar />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-tk-accent animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !scan?.report) {
    return (
      <div className="min-h-screen bg-tk-bg">
        <Navbar />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-tk-accent mx-auto mb-4" />
            <p className="font-mono text-sm text-tk-accent mb-4">{error || 'Report not found'}</p>
            <button onClick={() => navigate(`/scan/${id}`)} className="inline-flex items-center gap-2 px-4 py-2 border border-tk-border text-tk-text font-mono text-xs uppercase hover:border-tk-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Scan
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(`/scan/${id}`)}
              className="flex items-center gap-2 text-tk-muted hover:text-tk-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs">Back</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <SecurityScore score={scan.security_score || 0} size={80} animated={false} />
              <div>
                <h1 className="font-sans text-2xl text-tk-text">Security Report</h1>
                <p className="font-mono text-xs text-tk-muted">Scan #{id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 border border-tk-border text-tk-muted font-mono text-xs uppercase hover:border-tk-accent hover:text-tk-accent transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-tk-accent text-tk-bg font-mono text-xs uppercase hover:brightness-110 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-tk-border mb-8">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === 'report'
                  ? 'text-tk-accent border-tk-accent'
                  : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
              }`}
            >
              <FileCode className="w-4 h-4" />
              Report
            </button>
            <button
              onClick={() => setActiveTab('action')}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === 'action'
                  ? 'text-tk-accent border-tk-accent'
                  : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
              }`}
            >
              <FileCode className="w-4 h-4" />
              GitHub Action
            </button>
          </div>

          {/* Content */}
          <div className="bg-tk-surface border border-tk-border p-8">
            {activeTab === 'report' ? renderMarkdown(reportContent) : renderMarkdown(actionContent)}
          </div>
        </div>
      </div>
    </div>
  )
}
