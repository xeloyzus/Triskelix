import { useEffect, useRef, useState } from 'react'

interface SecurityScoreProps {
  score: number
  size?: number
  animated?: boolean
}

export default function SecurityScore({ score, size = 160, animated = true }: SecurityScoreProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const animRef = useRef<number>(0)

  const strokeWidth = size <= 80 ? 6 : 8
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayScore / 100) * circumference
  const compact = size < 96
  const scoreFontSize = compact ? Math.max(18, Math.round(size * 0.34)) : Math.round(size * 0.25)

  const getColor = (s: number) => {
    if (s <= 40) return '#ff3c3c'
    if (s <= 70) return '#ffcc00'
    return '#00ff88'
  }

  useEffect(() => {
    if (!animated) return
    let start = 0
    const duration = 1500
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * score)
      setDisplayScore(start)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [score, animated])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(displayScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animated ? 'stroke-dashoffset 0.1s linear' : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{ color: getColor(displayScore), fontSize: scoreFontSize }}
        >
          {displayScore}
        </span>
        {!compact && (
          <span className="font-mono text-xs text-tk-muted uppercase tracking-widest mt-1">
            Score
          </span>
        )}
      </div>
    </div>
  )
}
