import { useState } from 'react'
import { Download, Copy, Check, Shield } from 'lucide-react'

interface AttestationExportProps {
  scanId: string
  markdownContent: string
}

export default function AttestationExport({ scanId, markdownContent }: AttestationExportProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `triskelix-attestation-${scanId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Simple markdown preview — extract key sections
  const sections = markdownContent.split(/(?=^#{1,3}\s)/m).filter(Boolean)

  return (
    <div className="space-y-4">
      {/* Actions */}
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
          Download (.md)
        </button>
      </div>

      {/* Preview */}
      <div className="bg-tk-bg border border-tk-border p-6 max-h-[600px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-tk-border">
          <Shield className="w-5 h-5 text-tk-accent" />
          <h2 className="font-sans text-lg text-tk-text">AI Agent Governance Attestation</h2>
          <span className="font-mono text-xs text-tk-muted ml-auto">NIS2-scoped</span>
        </div>

        {sections.map((section, i) => {
          const lines = section.split('\n').filter(Boolean)
          const title = lines[0]?.replace(/^#+\s/, '') || ''
          const isHeading = section.startsWith('# ')
          const isSubheading = section.startsWith('## ')

          return (
            <div key={i} className={`mb-6 ${isHeading ? '' : 'pl-4'}`}>
              {isHeading && (
                <h1 className="font-sans text-2xl text-tk-text mb-4">{title}</h1>
              )}
              {isSubheading && (
                <h2 className="font-sans text-lg text-tk-text mb-3">{title}</h2>
              )}
              {!isHeading && !isSubheading && (
                <h3 className="font-sans text-base text-tk-text mb-3">{title}</h3>
              )}

              {lines.slice(1).map((line, j) => {
                if (line.startsWith('|')) {
                  // Table row — skip separator
                  if (line.includes('---')) return null
                  const cells = line.split('|').filter(c => c.trim())
                  return (
                    <div key={j} className="flex gap-4 py-1.5 border-b border-tk-border/30 font-mono text-xs">
                      {cells.map((cell, k) => (
                        <span key={k} className={k === 0 ? 'text-tk-text' : 'text-tk-muted'}>{cell.trim()}</span>
                      ))}
                    </div>
                  )
                }
                if (line.startsWith('- ')) {
                  return (
                    <div key={j} className="flex items-start gap-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tk-accent mt-1.5 flex-shrink-0" />
                      <span className="font-sans text-sm text-tk-text-secondary">{line.replace('- ', '')}</span>
                    </div>
                  )
                }
                return (
                  <p key={j} className="font-sans text-sm text-tk-text-secondary leading-relaxed mb-2">
                    {line.replace(/\*\*/g, '').replace(/`/g, '')}
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
