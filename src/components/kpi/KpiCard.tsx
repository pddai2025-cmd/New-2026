import React from 'react'

interface Props {
  label: string
  value: string
  sub?: string
  color?: string
  icon?: React.ReactNode
}

export default function KpiCard({ label, value, sub, color, icon }: Props) {
  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow)',
      display: 'flex', flexDirection: 'column', gap: 8,
      borderLeft: color ? `4px solid ${color}` : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ color: color || 'var(--blue)' }}>{icon}</span>}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}
