import type { Scores, Status } from '../types'

const WEIGHTS: Record<keyof Scores, number> = {
  schedule: 0.25,
  budget:   0.20,
  physical: 0.20,
  kpi:      0.15,
  risk:     0.10,
  report:   0.10,
}

export function calcScore(scores: Scores): number {
  const raw = (Object.keys(WEIGHTS) as Array<keyof Scores>)
    .reduce((sum, k) => sum + scores[k] * WEIGHTS[k], 0)
  return Math.round(raw * 20)
}

export function statusOf(score: number): Status {
  if (score >= 80) return 'green'
  if (score >= 60) return 'amber'
  return 'red'
}

export function riskLevel(p: number, i: number): 'critical' | 'medium' | 'low' {
  const v = p * i
  if (v >= 6) return 'critical'
  if (v >= 3) return 'medium'
  return 'low'
}

export const CRITERIA_LABELS: Record<keyof Scores, string> = {
  schedule: 'Выполнение календарного графика',
  budget:   'Освоение бюджета',
  physical: 'Выполнение физических работ',
  kpi:      'Достижение бизнес-KPI',
  risk:     'Управление рисками',
  report:   'Качество отчётности',
}

export const CRITERIA_WEIGHTS: Record<keyof Scores, number> = WEIGHTS
