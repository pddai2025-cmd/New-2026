import React from 'react'
import type { Status } from '../../types'

const CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  green: { label: 'По плану', color: 'var(--green)', bg: '#dcfce7' },
  amber: { label: 'Контроль', color: 'var(--amber)', bg: '#fef9c3' },
  red:   { label: 'Эскалация', color: 'var(--red)', bg: '#fee2e2' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: c.bg, color: c.color, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
      {c.label}
    </span>
  )
}
