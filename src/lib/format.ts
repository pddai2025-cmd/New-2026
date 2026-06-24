const numFmt = new Intl.NumberFormat('ru-RU')
const currFmt = new Intl.NumberFormat('ru-RU', { style: 'decimal', maximumFractionDigits: 1 })

export function formatNum(n: number): string {
  return numFmt.format(n)
}

export function formatBudget(billions: number): string {
  return `${currFmt.format(billions)} млрд ₸`
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`
}
