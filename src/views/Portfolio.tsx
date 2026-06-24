import React, { useState, useMemo } from 'react'
import { useApp } from '../App'
import type { Status, Project } from '../types'
import PortfolioTable from '../components/portfolio/PortfolioTable'
import ProjectModal from '../components/project/ProjectModal'

export default function Portfolio() {
  const { projects } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | ''>('')
  const [dirFilter, setDirFilter] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)

  const dirs = useMemo(() => Array.from(new Set(projects.map(p => p.dir))), [projects])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: '14px 20px',
        boxShadow: 'var(--shadow)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию, направлению, ответственному..."
            style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, outline: 'none', color: 'var(--text)', background: 'var(--bg)' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as Status | '')}
          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--text)', background: 'var(--bg)', cursor: 'pointer' }}>
          <option value="">Все статусы</option>
          <option value="green">По плану (зелёный)</option>
          <option value="amber">Контроль (жёлтый)</option>
          <option value="red">Эскалация (красный)</option>
        </select>
        <select value={dirFilter} onChange={e => setDirFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--text)', background: 'var(--bg)', cursor: 'pointer' }}>
          <option value="">Все направления</option>
          {dirs.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <PortfolioTable projects={projects} onSelect={setSelected} search={search} statusFilter={statusFilter} dirFilter={dirFilter} />
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
