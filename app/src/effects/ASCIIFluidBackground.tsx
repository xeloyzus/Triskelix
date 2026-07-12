import { useRef, useEffect } from 'react'

export default function ASCIIFluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })!
    let width = 0
    let height = 0
    let t = 0
    let animFrame = 0
    const mouse = { x: -9999, y: -9999 }

    const cols = typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 150
    const chars = ['+', '-', '~', '^', '.', ' ']
    const maxDist = 150

    function animate() {
      t += 0.005
      const amplitude = 15
      const colWidth = width / cols
      const rows = Math.ceil(height / colWidth)
      const fontSize = colWidth * 1.1

      ctx.font = `${fontSize}px monospace`
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, width, height)

      for (let y = 0; y < rows; y++) {
        const baseWave = Math.sin(y * 0.1 + t * 2) * amplitude
        const lineOffset = Math.sin(y * 0.05 + t) * 5

        for (let x = 0; x < cols; x++) {
          const posX = x * colWidth
          const posY = y * colWidth

          const dx = posX - mouse.x
          const dy = posY - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - (dist / maxDist))

          const waveX = x - baseWave - lineOffset
          const charIdx = Math.floor(Math.abs(waveX) % 6)
          const char = chars[Math.min(charIdx, chars.length - 1)]

          const spin = influence * 10
          const finalX = posX + (dx * spin * 0.1)
          const brightness = 50 + (influence * 50)

          if (y < rows * 0.25) {
            ctx.fillStyle = `hsl(0, 100%, ${brightness}%)`
          } else if (y < rows * 0.5) {
            ctx.fillStyle = `hsl(50, 100%, ${brightness}%)`
          } else if (y < rows * 0.75) {
            ctx.fillStyle = `hsl(150, 100%, ${brightness}%)`
          } else {
            ctx.fillStyle = `hsl(230, 40%, ${brightness}%)`
          }

          ctx.fillText(char, finalX, posY)
        }
      }

      animFrame = requestAnimationFrame(animate)
    }

    function handleResize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    function handleMouse(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouse)
    handleResize()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
