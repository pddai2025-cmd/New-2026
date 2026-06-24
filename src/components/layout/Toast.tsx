import React, { useEffect } from 'react'

interface Props {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [message, onClose])

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--navy)', color: '#fff',
      padding: '14px 20px', borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 14, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 12,
      zIndex: 9999,
      animation: 'slideUp 0.3s ease',
      maxWidth: 400,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
        marginLeft: 8, padding: 0, fontSize: 18, lineHeight: 1,
      }}>×</button>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  )
}
