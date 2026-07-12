import { ShieldAlert, Link2, ArrowRight, Scissors, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ComposedPath } from '@/types'
import { SEVERITY_COLORS } from '@/types'

export default function ComposedPathCard({ path }: { path: ComposedPath }) {
  const [expanded, setExpanded] = useState(true)
  const color = SEVERITY_COLORS[path.severity]

  return (
    <div className="border" style={{ borderColor: `${color}40` }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-tk-surface/50 transition-colors"
      >
        <ShieldAlert className="w-5 h-5 flex-shrink-0" style={{ color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="font-mono text-xs uppercase tracking-wider px-2 py-0.5"
              style={{ color, border: `1px solid ${color}40` }}
            >
              {path.severity}
            </span>
            <span className="font-mono text-xs text-tk-muted">Composed Path</span>
          </div>
          <h3 className="font-sans text-sm font-semibold text-tk-text truncate">
            {path.name}
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-tk-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-tk-muted flex-shrink-0" />
        )}
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-tk-border/50 space-y-4">
          {/* Chain */}
          <div>
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
              <Link2 className="w-3.5 h-3.5" />
              Exploit Chain
            </h4>
            <div className="space-y-2">
              {path.chain.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 flex items-center justify-center font-mono text-xs"
                      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
                    >
                      {i + 1}
                    </div>
                    {i < path.chain.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-tk-muted rotate-90 my-1" />
                    )}
                  </div>
                  <p className="font-mono text-xs text-tk-text-secondary leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative */}
          <div className="p-3 bg-tk-bg border border-tk-border">
            <h4 className="font-mono text-xs uppercase tracking-widest text-tk-muted mb-2">Attack Narrative</h4>
            <p className="font-sans text-sm text-tk-text-secondary leading-relaxed">
              {path.narrative}
            </p>
          </div>

          {/* Break the chain */}
          <div className="flex items-start gap-3 p-3 bg-tk-accent/5 border border-tk-accent/30">
            <Scissors className="w-4 h-4 text-tk-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-tk-accent mb-1">
                Break the Chain
              </h4>
              <p className="font-sans text-sm text-tk-text leading-relaxed">
                {path.break_the_chain}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
