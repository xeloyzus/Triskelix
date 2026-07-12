import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Upload, Github, Globe, ChevronRight, AlertCircle } from 'lucide-react'
import { STACK_OPTIONS } from '@/types'
import type { InputType, ScanMode } from '@/types'
import { api } from '@/api/client'
import { useStore } from '@/store'

export default function ScanInputForm() {
  const navigate = useNavigate()
  const { setIsLoading } = useStore()
  const [activeTab, setActiveTab] = useState<InputType>('code')
  const [code, setCode] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedStack, setSelectedStack] = useState<string[]>([])
  const [scanMode, setScanMode] = useState<ScanMode>('committed_only')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleStack = (tech: string) => {
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  const handleSubmit = async () => {
    setError('')

    if (activeTab === 'code' && !code.trim()) {
      setError('Please paste your code to scan.')
      return
    }
    if ((activeTab === 'github' || activeTab === 'url') && !inputValue.trim()) {
      setError(`Please enter a ${activeTab === 'github' ? 'GitHub repository URL' : 'live URL'}.`)
      return
    }

    if (activeTab === 'github') {
      const githubPattern = /^https?:\/\/github\.com\/[^/]+\/[^/]+/i
      if (!githubPattern.test(inputValue)) {
        setError('Invalid GitHub URL. Format: https://github.com/owner/repo')
        return
      }
    }

    if (activeTab === 'url') {
      const urlPattern = /^https?:\/\/.+/i
      if (!urlPattern.test(inputValue)) {
        setError('Invalid URL. Must start with http:// or https://')
        return
      }
    }

    if (activeTab === 'code' && code.length > 500000) {
      setError('Code exceeds 500KB limit.')
      return
    }

    setSubmitting(true)
    setIsLoading(true)

    try {
      const result = await api.createScan({
        input_type: activeTab,
        input_value: activeTab === 'code' ? undefined : inputValue,
        code: activeTab === 'code' ? code : undefined,
        stack: selectedStack,
        scan_mode: scanMode,
      })

      navigate(`/scan/${result.scan_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start scan. Please try again.')
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const tabs: { id: InputType; label: string; icon: typeof Upload }[] = [
    { id: 'code', label: 'Paste Code', icon: Upload },
    { id: 'github', label: 'GitHub Repo', icon: Github },
    { id: 'url', label: 'Live URL', icon: Globe },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex border-b border-tk-border mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-tk-accent border-tk-accent'
                  : 'text-tk-muted border-transparent hover:text-tk-text-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Stack Selector */}
      <div className="mb-6">
        <label className="block font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
          Tech Stack (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {STACK_OPTIONS.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleStack(tech)}
              className={`px-3 py-1.5 font-mono text-xs border transition-all ${
                selectedStack.includes(tech)
                  ? 'bg-tk-accent/20 border-tk-accent text-tk-accent'
                  : 'border-tk-border text-tk-muted hover:text-tk-text-secondary hover:border-tk-text-secondary'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Mode */}
      <div className="mb-6">
        <label className="block font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
          Scan Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            { id: 'committed_only' as const, label: 'Committed Code', detail: 'Repository and pasted source only' },
            { id: 'full_environment' as const, label: 'Full Environment', detail: 'Includes agent and local config signals' },
          ]).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setScanMode(mode.id)}
              className={`text-left p-4 border transition-all ${
                scanMode === mode.id
                  ? 'bg-tk-accent/10 border-tk-accent text-tk-text'
                  : 'bg-tk-surface border-tk-border text-tk-muted hover:border-tk-text-secondary'
              }`}
            >
              <span className="block font-mono text-xs uppercase tracking-wider mb-1">{mode.label}</span>
              <span className="block font-sans text-xs text-tk-muted">{mode.detail}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        {activeTab === 'code' && (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here...&#10;// You can include multiple files with headers like:&#10;// --- FILE: src/app.ts ---"
            className="w-full h-80 bg-tk-surface border border-tk-border p-4 font-mono text-sm text-tk-text placeholder:text-tk-muted/50 resize-none focus:outline-none focus:border-tk-accent transition-colors"
            spellCheck={false}
          />
        )}
        {activeTab === 'github' && (
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text placeholder:text-tk-muted/50 focus:outline-none focus:border-tk-accent transition-colors"
            />
            <p className="mt-2 font-mono text-xs text-tk-muted">
              We&apos;ll fetch and scan all source files in the repository.
            </p>
          </div>
        )}
        {activeTab === 'url' && (
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://your-app.com"
              className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text placeholder:text-tk-muted/50 focus:outline-none focus:border-tk-accent transition-colors"
            />
            <p className="mt-2 font-mono text-xs text-tk-muted">
              We&apos;ll analyze the deployed app for exposed secrets and security headers.
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-tk-accent/10 border border-tk-accent/30">
          <AlertCircle className="w-4 h-4 text-tk-accent flex-shrink-0" />
          <span className="font-mono text-xs text-tk-accent">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-4 bg-tk-accent text-tk-bg font-mono text-sm uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-tk-bg/30 border-t-tk-bg rounded-full animate-spin" />
            Initializing Scan...
          </>
        ) : (
          <>
            Start Security Scan
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}
