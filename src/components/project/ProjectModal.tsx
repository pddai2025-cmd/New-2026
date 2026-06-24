import React, { useEffect, useRef, useState } from 'react'
import type { Project, Scores } from '../../types'
import { calcScore, statusOf, CRITERIA_LABELS, CRITERIA_WEIGHTS } from '../../lib/scoring'
import { formatBudget, formatPercent } from '../../lib/format'
import StatusBadge from '../portfolio/StatusBadge'
import { useApp } from '../../App'

interface Props {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project: initialProject, onClose }: Props) {
  const { projects, updateScores } = useApp()
  const project = projects.find(p => p.id === initialProject.id) || initialProject
  const [scores, setScores] = useState<Scores>({ ...project.scores })
  const overlayRef = useRef<HTMLDivElement>(null)

  const score = calcScore(scores)
  const status = statusOf(score)

  useEffect(() => {
    setScores({ ...project.scores })
  }, [project.scores])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSlider = (key: keyof Scores, val: number) => {
    const next = { ...scores, [key]: val }
    setScores(next)
    updateScores(project.id, next)
  }

  const statusColor = status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)'
  const riskLevelFn = (p: number, i: number) => {
    const v = p * i
    if (v >= 6) return { label: 'Критический', color: 'var(--red)', bg: '#fee2e2' }
    if (v >= 3) return { label: 'Средний', color: 'var(--amber)', bg: '#fef9c3' }
    return { label: 'Низкий', color: 'var(--green)', bg: '#dcfce7' }
  }

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        zIndex: 1000, overflow: 'auto', padding: '40px 16px',
        animation: 'fadeIn 0.2s ease',
      }}>
      <div style={{
        background: 'var(--card)', borderRadius: 'var(--radius)',
        width: '100%', maxWidth: 760,
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideUp 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'var(--navy)', padding: '24px 28px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{project.dir}</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{project.name}</h2>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13 }}>
                <span><span style={{ opacity: 0.6 }}>Бюджет: </span><strong>{formatBudget(project.budget)}</strong></span>
                <span><span style={{ opacity: 0.6 }}>Срок: </span><strong>{project.deadline}</strong></span>
                <span><span style={{ opacity: 0.6 }}>Ответственный: </span><strong>{project.owner}</strong></span>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              width: 36, height: 36, borderRadius: 8, fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Выполнение</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{formatPercent(project.progress)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Освоение</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{formatPercent(project.budgetUse)}</div>
            </div>
            <div style={{ background: statusColor, padding: '8px 20px', borderRadius: 8, marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Балл</div>
              <div style={{ fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{score}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Description */}
          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Описание</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>{project.desc}</p>
          </section>

          {/* Criteria sliders */}
          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Оценки по критериям</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(Object.keys(CRITERIA_LABELS) as Array<keyof Scores>).map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: '0 0 220px', fontSize: 13 }}>
                    <div style={{ fontWeight: 500 }}>{CRITERIA_LABELS[key]}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Вес: {Math.round(CRITERIA_WEIGHTS[key] * 100)}%</div>
                  </div>
                  <input type="range" min={1} max={5} step={1} value={scores[key]}
                    onChange={e => handleSlider(key, Number(e.target.value))}
                    style={{ flex: 1, accentColor: statusColor }}
                    aria-label={CRITERIA_LABELS[key]}
                  />
                  <span style={{
                    fontWeight: 700, fontSize: 18, color: statusColor,
                    minWidth: 24, textAlign: 'center',
                  }}>{scores[key]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Risks */}
          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Основные риски</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.risks.map((r, i) => {
                const rl = riskLevelFn(r.p, r.i)
                return (
                  <div key={i} style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                    background: rl.bg, borderLeft: `4px solid ${rl.color}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: rl.color,
                        background: 'rgba(255,255,255,0.7)', padding: '1px 8px', borderRadius: 10,
                      }}>{rl.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>П:{r.p} × В:{r.i}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong>Меры:</strong> {r.mitig}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong>Владелец:</strong> {r.owner}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* History */}
          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>История изменений</h3>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
              {project.history.map((h, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
                  <div style={{
                    position: 'absolute', left: -16, top: 4,
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'var(--blue)', border: '2px solid var(--card)',
                  }} />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{h.d}</div>
                  <div style={{ fontSize: 13 }}>{h.t}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}
