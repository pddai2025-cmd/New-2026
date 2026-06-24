import React, { useEffect } from 'react'
import { useApp } from '../../App'

interface Props {
  open: boolean
  onClose: () => void
  needsAttention: number
}

const NAV = [
  { id: 'dashboard' as const, label: 'Дашборд', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: 'portfolio' as const, label: 'Портфель', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { id: 'risks' as const, label: 'Реестр рисков', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: 'committee' as const, label: 'Комитет', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
]

export default function Sidebar({ open, onClose, needsAttention }: Props) {
  const { view, setView } = useApp()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99, display: 'none' }} className="sidebar-overlay" />}
      <nav style={{
        width: 'var(--sidebar-w)',
        background: 'var(--navy)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }} className={`sidebar${open ? ' open' : ''}`}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--blue)', letterSpacing: 1 }}>Project Pulse</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>АО «Казахтелеком»</div>
        </div>
        <ul style={{ listStyle: 'none', padding: '16px 0', flex: 1 }}>
          {NAV.map(item => (
            <li key={item.id}>
              <button
                onClick={() => { setView(item.id); onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 16px',
                  background: view === item.id ? 'rgba(0,122,199,0.2)' : 'transparent',
                  color: view === item.id ? 'var(--blue)' : 'rgba(255,255,255,0.75)',
                  border: 'none',
                  borderLeft: view === item.id ? '3px solid var(--blue)' : '3px solid transparent',
                  fontSize: 14, fontWeight: view === item.id ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {item.icon}
                {item.label}
                {item.id === 'committee' && needsAttention > 0 && (
                  <span style={{
                    marginLeft: 'auto', background: 'var(--red)', color: '#fff',
                    borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700
                  }}>{needsAttention}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 11, opacity: 0.4, textAlign: 'center' }}>
          v1.0 · Июнь 2026
        </div>
      </nav>
      <style>{`
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar.open { transform: translateX(0) !important; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  )
}
