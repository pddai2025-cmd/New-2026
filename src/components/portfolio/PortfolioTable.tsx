import React, { useState, useMemo } from 'react'
import type { Project, Status } from '../../types'
import { calcScore, statusOf } from '../../lib/scoring'
import { formatBudget, formatPercent } from '../../lib/format'
import StatusBadge from './StatusBadge'

type SortKey = 'name' | 'owner' | 'budget' | 'progress' | 'budgetUse' | 'score'

interface Props {
  projects: Project[]
  onSelect: (p: Project) => void
  search: string
  statusFilter: Status | ''
  dirFilter: string
}

export default function PortfolioTable({ projects, onSelect, search, statusFilter, dirFilter }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let list = projects
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.dir.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q))
    }
    if (statusFilter) {
      list = list.filter(p => statusOf(calcScore(p.scores)) === statusFilter)
    }
    if (dirFilter) {
      list = list.filter(p => p.dir === dirFilter)
    }
    const scored = list.map(p => ({ p, score: calcScore(p.scores), status: statusOf(calcScore(p.scores)) }))
    scored.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.p.name; bv = b.p.name; break
        case 'owner': av = a.p.owner; bv = b.p.owner; break
        case 'budget': av = a.p.budget; bv = b.p.budget; break
        case 'progress': av = a.p.progress; bv = b.p.progress; break
        case 'budgetUse': av = a.p.budgetUse; bv = b.p.budgetUse; break
        case 'score': av = a.score; bv = b.score; break
        default: av = 0; bv = 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return scored
  }, [projects, search, statusFilter, dirFilter, sortKey, sortDir])

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === k ? 1 : 0.3 }}>
      {sortKey === k && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  )

  const COL = (label: string, k: SortKey) => (
    <th onClick={() => handleSort(k)} style={{
      padding: '12px 16px', textAlign: 'left', fontSize: 12,
      color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: 0.5, cursor: 'pointer', userSelect: 'none',
      whiteSpace: 'nowrap',
      background: 'var(--bg)',
    }}>
      {label}<SortIcon k={k} />
    </th>
  )

  const colorOf = (s: Status) => s === 'green' ? 'var(--green)' : s === 'amber' ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {COL('Проект / направление', 'name')}
            {COL('Ответственный', 'owner')}
            {COL('Бюджет', 'budget')}
            {COL('Выполнение работ', 'progress')}
            {COL('Освоение бюджета', 'budgetUse')}
            {COL('Балл', 'score')}
            <th style={{ padding: '12px 16px', background: 'var(--bg)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ p, score, status }) => (
            <tr key={p.id} onClick={() => onSelect(p)} style={{
              borderBottom: '1px solid var(--border)', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f8')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.dir}</div>
              </td>
              <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{p.owner}</td>
              <td style={{ padding: '14px 16px', fontWeight: 500 }}>{formatBudget(p.budget)}</td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, minWidth: 60 }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', background: colorOf(status), borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: colorOf(status), fontWeight: 600, minWidth: 32 }}>{formatPercent(p.progress)}</span>
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, minWidth: 60 }}>
                    <div style={{ width: `${p.budgetUse}%`, height: '100%', background: colorOf(status), borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: colorOf(status), fontWeight: 600, minWidth: 32 }}>{formatPercent(p.budgetUse)}</span>
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: colorOf(status) }}>{score}</span>
              </td>
              <td style={{ padding: '14px 16px' }}><StatusBadge status={status} /></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Проекты не найдены</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
