import React, { useMemo } from 'react'
import { useApp } from '../App'
import { riskLevel } from '../lib/scoring'

const LEVEL_CONFIG = {
  critical: { label: 'Критический', color: 'var(--red)', bg: '#fee2e2', order: 0 },
  medium:   { label: 'Средний',     color: 'var(--amber)', bg: '#fef9c3', order: 1 },
  low:      { label: 'Низкий',      color: 'var(--green)', bg: '#dcfce7', order: 2 },
}

export default function Risks() {
  const { projects } = useApp()

  const allRisks = useMemo(() => {
    const items = projects.flatMap(p => p.risks.map(r => ({
      ...r, projectName: p.name, projectId: p.id,
      level: riskLevel(r.p, r.i), score: r.p * r.i,
    })))
    items.sort((a, b) => b.score - a.score || LEVEL_CONFIG[a.level].order - LEVEL_CONFIG[b.level].order)
    return items
  }, [projects])

  const byLevel = useMemo(() => ({
    critical: allRisks.filter(r => r.level === 'critical'),
    medium:   allRisks.filter(r => r.level === 'medium'),
    low:      allRisks.filter(r => r.level === 'low'),
  }), [allRisks])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {(['critical', 'medium', 'low'] as const).map(l => {
          const c = LEVEL_CONFIG[l]
          return (
            <div key={l} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '16px 20px', boxShadow: 'var(--shadow)', borderLeft: `4px solid ${c.color}` }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: c.color, marginTop: 4 }}>{byLevel[l].length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>рисков</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {allRisks.map((r, i) => {
          const c = LEVEL_CONFIG[r.level]
          return (
            <div key={i} style={{
              background: 'var(--card)', borderRadius: 'var(--radius)',
              padding: '16px 20px', boxShadow: 'var(--shadow)',
              borderLeft: `4px solid ${c.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                      color: c.color, background: c.bg,
                    }}>{c.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Балл риска: {r.score}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>📁 {r.projectName}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{r.t}</div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Вероятность</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3].map(v => (
                          <div key={v} style={{ width: 20, height: 8, borderRadius: 2, background: v <= r.p ? c.color : '#e2e8f0' }} />
                        ))}
                        <span style={{ fontSize: 11, color: c.color, marginLeft: 4, fontWeight: 600 }}>{r.p}/3</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Влияние</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3].map(v => (
                          <div key={v} style={{ width: 20, height: 8, borderRadius: 2, background: v <= r.i ? c.color : '#e2e8f0' }} />
                        ))}
                        <span style={{ fontSize: 11, color: c.color, marginLeft: 4, fontWeight: 600 }}>{r.i}/3</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong>Меры снижения:</strong> {r.mitig}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}><strong>Владелец:</strong> {r.owner}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
