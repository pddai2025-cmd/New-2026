import React, { useEffect, useRef, useCallback } from 'react'

interface Bar { label: string; value: number; color: string; max?: number }
interface Props { data: Bar[]; height?: number; unit?: string }

export default function BarChart({ data, height = 160, unit = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth || 300
    const h = height
    canvas.width = w * dpr; canvas.height = h * dpr
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)
    const maxVal = Math.max(...data.map(d => d.max ?? d.value), 1)
    const pad = { l: 8, r: 8, t: 20, b: 44 }
    const n = data.length || 1
    const gap = (w - pad.l - pad.r) / n
    const barW = gap * 0.55
    data.forEach((d, i) => {
      const x = pad.l + i * gap + gap / 2 - barW / 2
      const barH = (d.value / maxVal) * (h - pad.t - pad.b)
      const y = h - pad.b - barH
      ctx.fillStyle = d.color
      ctx.beginPath()
      const rad = Math.min(4, barW / 2)
      ctx.moveTo(x + rad, y); ctx.lineTo(x + barW - rad, y)
      ctx.arcTo(x + barW, y, x + barW, y + rad, rad)
      ctx.lineTo(x + barW, y + barH); ctx.lineTo(x, y + barH)
      ctx.arcTo(x, y, x + rad, y, rad); ctx.closePath(); ctx.fill()
      ctx.fillStyle = d.color
      ctx.font = `bold 11px Montserrat, sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(`${Math.round(d.value)}${unit}`, x + barW / 2, y - 5)
      ctx.fillStyle = '#6B7A90'; ctx.font = `10px Montserrat, sans-serif`
      const maxLabelW = gap - 4
      const words = d.label.split(' ')
      let line = '', ly = h - pad.b + 14
      words.forEach((word, wi) => {
        const test = line ? `${line} ${word}` : word
        if (ctx.measureText(test).width > maxLabelW && wi > 0) {
          ctx.fillText(line, x + barW / 2, ly); line = word; ly += 12
        } else line = test
      })
      if (line) ctx.fillText(line, x + barW / 2, ly)
    })
  }, [data, height, unit])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    const obs = new ResizeObserver(draw)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [draw])

  return <div ref={containerRef} style={{ width: '100%' }}><canvas ref={canvasRef} style={{ display: 'block' }} /></div>
}
