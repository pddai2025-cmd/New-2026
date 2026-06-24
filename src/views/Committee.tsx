import React, { useMemo } from 'react'
import { useApp } from '../App'
import { calcScore, statusOf } from '../lib/scoring'
import { formatBudget, formatPercent } from '../lib/format'
import StatusBadge from '../components/portfolio/StatusBadge'

function getRecommendation(score: number, _p: { progress: number; budgetUse: number; scores: { risk: number } }) {
  if (score >= 80) return 'Продолжить реализацию'
  if (score >= 70) return 'Усилить контроль'
  if (score >= 60) return 'Пересмотреть бюджет'
  return 'Вынести на комитет'
}

function getFlags(p: { progress: number; budgetUse: number; scores: { risk: number } }, score: number) {
  const flags: string[] = []
  if (p.budgetUse > p.progress + 10) flags.push('Опережающее освоение бюджета')
  if (score < 60) flags.push('Балл ниже 60')
  if (p.progress < 40) flags.push('Низкий прогресс работ')
  if (p.scores.risk <= 2) flags.push('Слабое управление рисками')
  return flags
}

export default function Committee() {
  const { projects, applyStressTest, applyRecovery, resetToInitial } = useApp()

  const ranked = useMemo(() => {
    return projects
      .map(p => {
        const score = calcScore(p.scores)
        const status = statusOf(score)
        const recommendation = getRecommendation(score, p)
        const flags = getFlags(p, score)
        return { p, score, status, recommendation, flags }
      })
      .sort((a, b) => a.score - b.score)
  }, [projects])

  const attention = ranked.filter(r => r.status !== 'green').length

  const recColor = (rec: string) => {
    if (rec === 'Продолжить реализацию') return 'var(--green)'
    if (rec === 'Усилить контроль') return 'var(--amber)'
    if (rec === 'Пересмотреть бюджет') return '#f97316'
    return 'var(--red)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: '16px 20px',
        boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', flex: 1 }}>
          Сценарии «что будет, если»:
        </span>
        <button onClick={applyStressTest} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-sm)',
          background: '#fee2e2', color: 'var(--red)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}>⚡ Стресс-тест портфеля</button>
        <button onClick={applyRecovery} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-sm)',
          background: '#dcfce7', color: 'var(--green)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>📈 План восстановления</button>
        <button onClick={resetToInitial} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>↩ Сбросить к исходным</button>
      </div>

      <div style={{
        background: attention > 0 ? '#fee2e2' : '#dcfce7',
        borderRadius: 'var(--radius-sm)', padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        border: `1px solid ${attention > 0 ? 'var(--red)' : 'var(--green)'}`,
      }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: attention > 0 ? 'var(--red)' : 'var(--green)' }}>{attention}</span>
        <span style={{ fontSize: 14, color: attention > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
          {attention > 0 ? `проект(ов) требуют внимания комитета` : 'Все проекты реализуются по плану'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ranked.map(({ p, score, status, recommendation, flags }) => (
          <div key={p.id} style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: '20px 24px',
            boxShadow: 'var(--shadow)',
            borderLeft: `4px solid ${status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <StatusBadge status={status} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.dir}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>Бюджет: <strong>{formatBudget(p.budget)}</strong></span>
                  <span>Прогресс: <strong>{formatPercent(p.progress)}</strong></span>
                  <span>Освоение: <strong>{formatPercent(p.budgetUse)}</strong></span>
                  <span>Ответственный: <strong>{p.owner}</strong></span>
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  fontSize: 32, fontWeight: 800,
                  color: status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)',
                }}>{score}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>балл</div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Рекомендация:</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: recColor(recommendation) }}>{recommendation}</span>
              {flags.length > 0 && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {flags.map((f, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: '#fee2e2', color: 'var(--red)', fontWeight: 600,
                    }}>⚠ {f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
