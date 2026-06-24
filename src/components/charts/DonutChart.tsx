import React, { useEffect, useRef } from 'react'

interface Segment { value: number; color: string; label: string }
interface Props { data: Segment[]; size?: number }

export default function DonutChart({ data, size = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const total = data.reduce((s, d) => s + d.value, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, size, size)
    const cx = size / 2, cy = size / 2, r = size * 0.38, ri = r * 0.55
    let angle = -Math.PI / 2
    data.forEach(seg => {
      if (!seg.value) return
      const sweep = (seg.value / (total || 1)) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, angle, angle + sweep)
      ctx.closePath()
      ctx.fillStyle = seg.color
      ctx.fill()
      angle += sweep
    })
    ctx.beginPath()
    ctx.arc(cx, cy, ri, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.font = `bold ${Math.round(size * 0.16)}px Montserrat, sans-serif`
    ctx.fillStyle = '#1A2B4A'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(total), cx, cy)
  }, [data, size, total])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <canvas ref={canvasRef} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map(d => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: d.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--text-muted)' }}>{d.label}:</span>
            <strong style={{ color: d.color }}>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
