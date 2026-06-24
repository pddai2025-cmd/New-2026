import { describe, it, expect } from 'vitest'
import { calcScore, statusOf, riskLevel } from './scoring'

describe('calcScore', () => {
  it('returns 100 when all scores are 5', () => {
    expect(calcScore({ schedule: 5, budget: 5, physical: 5, kpi: 5, risk: 5, report: 5 })).toBe(100)
  })
  it('returns 80 when all scores are 4', () => {
    expect(calcScore({ schedule: 4, budget: 4, physical: 4, kpi: 4, risk: 4, report: 4 })).toBe(80)
  })
  it('returns 60 when all scores are 3', () => {
    expect(calcScore({ schedule: 3, budget: 3, physical: 3, kpi: 3, risk: 3, report: 3 })).toBe(60)
  })
  it('returns 40 when all scores are 2', () => {
    expect(calcScore({ schedule: 2, budget: 2, physical: 2, kpi: 2, risk: 2, report: 2 })).toBe(40)
  })
  it('returns 20 when all scores are 1', () => {
    expect(calcScore({ schedule: 1, budget: 1, physical: 1, kpi: 1, risk: 1, report: 1 })).toBe(20)
  })
})

describe('statusOf', () => {
  it('green for 80-100', () => {
    expect(statusOf(100)).toBe('green')
    expect(statusOf(80)).toBe('green')
  })
  it('amber for 60-79', () => {
    expect(statusOf(79)).toBe('amber')
    expect(statusOf(60)).toBe('amber')
  })
  it('red for below 60', () => {
    expect(statusOf(59)).toBe('red')
    expect(statusOf(0)).toBe('red')
  })
})

describe('riskLevel', () => {
  it('critical when p*i >= 6', () => {
    expect(riskLevel(2, 3)).toBe('critical')
    expect(riskLevel(3, 3)).toBe('critical')
    expect(riskLevel(3, 2)).toBe('critical')
  })
  it('medium when p*i 3-5', () => {
    expect(riskLevel(1, 3)).toBe('medium')
    expect(riskLevel(2, 2)).toBe('medium') // 4 -> medium
    expect(riskLevel(3, 1)).toBe('medium')
  })
  it('low when p*i < 3', () => {
    expect(riskLevel(1, 1)).toBe('low')
    expect(riskLevel(1, 2)).toBe('low') // 2 -> low? Wait, 2 < 3 -> low
  })
})
