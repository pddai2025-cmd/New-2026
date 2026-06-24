import React from 'react'
import { useApp } from '../../App'

interface Props {
  onMenuClick: () => void
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Дашборд',
  portfolio: 'Портфель проектов',
  risks: 'Реестр рисков',
  committee: 'Инвестиционный комитет',
}

export default function Topbar({ onMenuClick }: Props) {
  const { view } = useApp()
  const now = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      flexShrink: 0,
    }}>
      <button onClick={onMenuClick} style={{
        display: 'none', background: 'none', border: 'none', padding: 8, color: 'var(--text)',
      }} className="menu-btn" aria-label="Меню">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{VIEW_TITLES[view]}</h1>
      <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>{now}</div>
      <style>{`@media (max-width: 768px) { .menu-btn { display: flex !important; } }`}</style>
    </header>
  )
}
