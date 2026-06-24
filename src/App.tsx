import React, { createContext, useContext, useReducer, useState, useCallback } from 'react'
import { INITIAL_PROJECTS } from './data/projects'
import type { Project, Scores } from './types'
import { calcScore, statusOf } from './lib/scoring'
import Dashboard from './views/Dashboard'
import Portfolio from './views/Portfolio'
import Risks from './views/Risks'
import Committee from './views/Committee'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Toast from './components/layout/Toast'

type View = 'dashboard' | 'portfolio' | 'risks' | 'committee'

interface AppState {
  projects: Project[]
  view: View
  toast: string | null
}

interface AppContextValue extends AppState {
  setView: (v: View) => void
  updateScores: (id: string, scores: Scores) => void
  applyStressTest: () => void
  applyRecovery: () => void
  resetToInitial: () => void
  dismissToast: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}

function deepCloneProjects(projects: Project[]): Project[] {
  return projects.map(p => ({ ...p, scores: { ...p.scores }, risks: p.risks.map(r => ({ ...r })), history: [...p.history] }))
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(deepCloneProjects(INITIAL_PROJECTS))
  const [view, setView] = useState<View>('dashboard')
  const [toast, setToast] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const updateScores = useCallback((id: string, scores: Scores) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, scores: { ...scores } } : p))
  }, [])

  const applyStressTest = useCallback(() => {
    setProjects(prev => prev.map(p => ({
      ...p,
      scores: {
        schedule: Math.max(1, p.scores.schedule - 1),
        budget: Math.max(1, p.scores.budget - 1),
        physical: Math.max(1, p.scores.physical - 1),
        kpi: Math.max(1, p.scores.kpi - 1),
        risk: Math.max(1, p.scores.risk - 1),
        report: Math.max(1, p.scores.report - 1),
      }
    })))
    setToast('Стресс-тест применён: все оценки снижены на 1 балл')
  }, [])

  const applyRecovery = useCallback(() => {
    setProjects(prev => prev.map(p => ({
      ...p,
      scores: {
        schedule: Math.min(5, p.scores.schedule + 1),
        budget: Math.min(5, p.scores.budget + 1),
        physical: Math.min(5, p.scores.physical + 1),
        kpi: Math.min(5, p.scores.kpi + 1),
        risk: Math.min(5, p.scores.risk + 1),
        report: Math.min(5, p.scores.report + 1),
      }
    })))
    setToast('План восстановления применён: все оценки повышены на 1 балл')
  }, [])

  const resetToInitial = useCallback(() => {
    setProjects(deepCloneProjects(INITIAL_PROJECTS))
    setToast('Данные сброшены к исходным значениям')
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const needsAttention = projects.filter(p => statusOf(calcScore(p.scores)) !== 'green').length

  return (
    <AppContext.Provider value={{ projects, view, toast, setView, updateScores, applyStressTest, applyRecovery, resetToInitial, dismissToast }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} needsAttention={needsAttention} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
          <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {view === 'dashboard' && <Dashboard />}
            {view === 'portfolio' && <Portfolio />}
            {view === 'risks' && <Risks />}
            {view === 'committee' && <Committee />}
          </main>
        </div>
        {toast && <Toast message={toast} onClose={dismissToast} />}
      </div>
    </AppContext.Provider>
  )
}
