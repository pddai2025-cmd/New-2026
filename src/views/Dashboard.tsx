import React, { useMemo } from 'react'
import { useApp } from '../App'
import { calcScore, statusOf } from '../lib/scoring'
import { formatBudget } from '../lib/format'
import KpiCard from '../components/kpi/KpiCard'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import TrendChart from '../components/charts/TrendChart'

const CARD: React.CSSProperties = {
  background: 'var(--card)', borderRadius: 'var(--radius)', padding: '20px 24px', boxShadow: 'var(--shadow)',
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={CARD}>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const { projects } = useApp()

  const { green, amber, red, totalBudget, avgScore } = useMemo(() => {
    const scored = projects.map(p => statusOf(calcScore(p.scores)))
    return {
      green: scored.filter(s => s === 'green').length,
      amber: scored.filter(s => s === 'amber').length,
      red: scored.filter(s => s === 'red').length,
      totalBudget: projects.reduce((s, p) => s + p.budget, 0),
      avgScore: Math.round(projects.reduce((s, p) => s + calcScore(p.scores), 0) / (projects.length || 1)),
    }
  }, [projects])

  const trend = useMemo(() => {
    const base = avgScore
    return [
      { label: 'Янв', value: Math.max(20, base - 15) },
      { label: 'Фев', value: Math.max(20, base - 12) },
      { label: 'Мар', value: Math.max(20, base - 8) },
      { label: 'Апр', value: Math.max(20, base - 5) },
      { label: 'Май', value: Math.max(20, base - 2) },
      { label: 'Июн', value: base },
    ]
  }, [avgScore])

  const statusColor = (s: string) => s === 'green' ? 'var(--green)' : s === 'amber' ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <KpiCard label="Всего проектов" value={String(projects.length)} color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>} />
        <KpiCard label="Общий бюджет" value={formatBudget(totalBudget)} color="var(--navy)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <KpiCard label="По плану" value={String(green)} sub="зелёных" color="var(--green)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
        <KpiCard label="Контроль" value={String(amber)} sub="жёлтых" color="var(--amber)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
        <KpiCard label="Эскалация" value={String(red)} sub="красных" color="var(--red)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <KpiCard label="Средний балл" value={String(avgScore)} sub="по портфелю" color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <ChartCard title="Распределение по статусам">
          <DonutChart data={[
            { value: green, color: 'var(--green)', label: 'По плану' },
            { value: amber, color: 'var(--amber)', label: 'Контроль' },
            { value: red,   color: 'var(--red)',   label: 'Эскалация' },
          ]} />
        </ChartCard>
        <ChartCard title="Динамика среднего балла">
          <TrendChart data={trend} />
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <ChartCard title="Освоение бюджета по проектам">
          <BarChart unit="%" data={projects.map(p => ({
            label: p.name.split(' ').slice(0, 3).join(' '),
            value: p.budgetUse,
            color: statusColor(statusOf(calcScore(p.scores))),
            max: 100,
          }))} />
        </ChartCard>
        <ChartCard title="Выполнение работ по проектам">
          <BarChart unit="%" data={projects.map(p => ({
            label: p.name.split(' ').slice(0, 3).join(' '),
            value: p.progress,
            color: statusColor(statusOf(calcScore(p.scores))),
            max: 100,
          }))} />
        </ChartCard>
      </div>
    </div>
  )
}
