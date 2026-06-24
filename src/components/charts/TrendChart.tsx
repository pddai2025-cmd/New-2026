import React, { useEffect, useRef, useCallback } from 'react'

interface Point { label: string; value: number }
interface Props { data: Point[]; height?: number; color?: string }

export default function TrendChart({ data, height = 140, color = '#007AC7' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length < 2) return
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth || 300
    const h = height
    canvas.width = w * dpr; canvas.height = h * dpr
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)
    const pad = { l: 36, r: 12, t: 16, b: 28 }
    const vals = data.map(d => d.value)
    const maxV = Math.max(...vals, 100), minV = Math.min(...vals, 0)
    const rx = (i: number) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r)
    const ry = (v: number) => pad.t + (1 - (v - minV) / (maxV - minV + 0.01)) * (h - pad.t - pad.b)
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1
    ;[0, 25, 50, 75, 100].forEach(v => {
      const y = ry(v)
      if (y < pad.t || y > h - pad.b) return
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke()
      ctx.fillStyle = '#6B7A90'; ctx.font = '9px Montserrat, sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(String(v), pad.l - 4, y + 3)
    })
    const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b)
    grad.addColorStop(0, `${color}33`); grad.addColorStop(1, `${color}00`)
    ctx.beginPath(); ctx.moveTo(rx(0), ry(data[0].value))
    data.forEach((d, i) => { if (i > 0) ctx.lineTo(rx(i), ry(d.value)) })
    ctx.lineTo(rx(data.length - 1), h - pad.b); ctx.lineTo(rx(0), h - pad.b); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()
    ctx.beginPath(); ctx.moveTo(rx(0), ry(data[0].value))
    data.forEach((d, i) => { if (i > 0) ctx.lineTo(rx(i), ry(d.value)) })
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke()
    data.forEach((d, i) => {
      ctx.beginPath(); ctx.arc(rx(i), ry(d.value), 4, 0, 2 * Math.PI)
      ctx.fillStyle = color; ctx.fill()
      ctx.fillStyle = '#6B7A90'; ctx.font = '10px Montserrat, sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(d.label, rx(i), h - pad.b + 14)
    })
  }, [data, height, color])

  useEffect(() => { draw() }, [draw])
  useEffect(() => {
    const obs = new ResizeObserver(draw)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [draw])

  return <div ref={containerRef} style={{ width: '100%' }}><canvas ref={canvasRef} style={{ display: 'block' }} /></div>
}
