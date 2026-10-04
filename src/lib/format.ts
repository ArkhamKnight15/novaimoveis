import type { Purpose } from '../types/property'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const integer = new Intl.NumberFormat('pt-BR')

/** R$ 8.900.000 */
export function formatCurrency(value: number): string {
  return currency.format(value).replace(/ /g, ' ')
}

/** R$ 8,9 mi · R$ 12,5 mil — para filtros e chips. */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `R$ ${millions.toLocaleString('pt-BR', { maximumFractionDigits: millions < 10 ? 1 : 0 })} mi`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    return `R$ ${thousands.toLocaleString('pt-BR', { maximumFractionDigits: thousands < 10 ? 1 : 0 })} mil`
  }
  return formatCurrency(value)
}

export function formatPrice(value: number, purpose: Purpose): string {
  return purpose === 'aluguel' ? `${formatCurrency(value)}/mês` : formatCurrency(value)
}

export function formatArea(value: number): string {
  return `${integer.format(value)} m²`
}

export function formatNumber(value: number): string {
  return integer.format(value)
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

/** Data longa em português: "quinta-feira, 9 de outubro". */
export function formatLongDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
