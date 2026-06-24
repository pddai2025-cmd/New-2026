import React, { useMemo } from 'react'
import { useApp } from '../App'
import { calcScore, statusOf } from '../lib/scoring'
import { formatBudget, formatPercent } from '../lib/format'
import StatusBadge from '../components/portfolio/StatusBadge'
import type { Project, Scores } from '../types'

function getRecommendation(score: number): string {
  if (score >= 80) return 'Продолжить реализацию'
  if (score >= 70) return 'Усилить контроль'
  if (score >= 60) return 'Пересмотреть бюджет'
  return 'Вынести на комитет'
}

function getFlags(p: Project, score: number): string[] {
  const flags: string[] = []
  if (p.budgetUse > p.progress + 10) flags.push('Опережающее освоение бюджета')
  if (score < 60) flags.push('Балл ниже 60')
  if (p.progress < 40) flags.push('Низкий прогресс работ')
  if (p.scores.risk <= 2) flags.push('Слабое управление рисками')
  return flags
}

const REC_COLOR: Record<string, string> = {
  'Продолжить реализацию': 'var(--green)',
  'Усилить контроль': 'var(--amber)',
  'Пересмотреть бюджет': '#f97316',
  'Вынести на комитет': 'var(--red)',
}

export default function Committee() {
  const { projects, applyStressTest, applyRecovery, resetToInitial } = useApp()

  const ranked = useMemo(() =>
    projects
      .map(p => {
        const score = calcScore(p.scores)
        return { p, score, status: statusOf(score), recommendation: getRecommendation(score), flags: getFlags(p, score) }
      })
      .sort((a, b) => a.score - b.score),
    [projects]
  )

  const attention = ranked.filter(r => r.status !== 'green').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Scenario bar */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '14px 20px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginRight: 4 }}>Сценарии «что будет, если»:</span>
        <button onClick={applyStressTest} style={{ padding: '7px 14px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: 'var(--red)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ⚡ Стресс-тест портфеля
        </button>
        <button onClick={applyRecovery} style={{ padding: '7px 14px', borderRadius: 'var(--radius-sm)', background: '#dcfce7', color: 'var(--green)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          📈 План восстановления
        </button>
        <button onClick={resetToInitial} style={{ padding: '7px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ↩ Сбросить к исходным
        </button>
      </div>

      {/* Attention banner */}
      <div style={{
        borderRadius: 'var(--radius-sm)', padding: '10px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
        background: attention > 0 ? '#fee2e2' : '#dcfce7',
        border: `1px solid ${attention > 0 ? 'var(--red)' : 'var(--green)'}`,
      }}>
        <span style={{ fontWeight: 800, fontSize: 22, color: attention > 0 ? 'var(--red)' : 'var(--green)' }}>{attention}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: attention > 0 ? 'var(--red)' : 'var(--green)' }}>
          {attention > 0 ? 'проект(ов) требуют внимания инвестиционного комитета' : 'Все проекты реализуются по плану'}
        </span>
      </div>

      {/* Project cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranked.map(({ p, score, status, recommendation, flags }) => {
          const borderColor = status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)'
          const scoreColor = borderColor
          return (
            <div key={p.id} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '18px 22px', boxShadow: 'var(--shadow)', borderLeft: `4px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <StatusBadge status={status} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.dir}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>Бюджет: <strong>{formatBudget(p.budget)}</strong></span>
                    <span>Прогресс: <strong>{formatPercent(p.progress)}</strong></span>
                    <span>Освоение: <strong>{formatPercent(p.budgetUse)}</strong></span>
                    <span>Ответственный: <strong>{p.owner}</strong></span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>балл</div>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Рекомендация:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: REC_COLOR[recommendation] || 'var(--text)' }}>{recommendation}</span>
                {flags.length > 0 && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {flags.map((f, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#fee2e2', color: 'var(--red)', fontWeight: 600 }}>⚠ {f}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
