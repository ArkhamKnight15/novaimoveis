import { X } from 'lucide-react'
import { propertyTypeLabels } from '../../data/catalog'
import { formatCompactCurrency } from '../../lib/format'
import type { PropertyQuery } from '../../types/property'
import { useLocationOptions } from '../../hooks/useLocationOptions'

interface ActiveFiltersProps {
  query: PropertyQuery
  onRemove: (patch: Partial<PropertyQuery>) => void
  onClear: () => void
}

/** Chips removíveis com os filtros aplicados. */
export function ActiveFilters({ query, onRemove, onClear }: ActiveFiltersProps) {
  const locationOptions = useLocationOptions()
  const chips: { key: string; label: string; patch: Partial<PropertyQuery> }[] = []
  if (query.query) chips.push({ key: 'q', label: `“${query.query}”`, patch: { query: undefined } })
  if (query.location) {
    const option = locationOptions.find((item) => item.value === query.location)
    chips.push({ key: 'local', label: option?.label ?? query.location, patch: { location: undefined } })
  }
  if (query.type) chips.push({ key: 'tipo', label: propertyTypeLabels[query.type], patch: { type: undefined } })
  if (query.priceMin || query.priceMax) {
    const label =
      query.priceMin && query.priceMax
        ? `${formatCompactCurrency(query.priceMin)} a ${formatCompactCurrency(query.priceMax)}`
        : query.priceMin
          ? `A partir de ${formatCompactCurrency(query.priceMin)}`
          : `Até ${formatCompactCurrency(query.priceMax ?? 0)}`
    chips.push({ key: 'preco', label, patch: { priceMin: undefined, priceMax: undefined } })
  }
  if (query.bedrooms)
    chips.push({ key: 'quartos', label: `${query.bedrooms}+ quartos`, patch: { bedrooms: undefined } })
  if (query.bathrooms)
    chips.push({ key: 'banheiros', label: `${query.bathrooms}+ banheiros`, patch: { bathrooms: undefined } })
  if (query.parking) chips.push({ key: 'vagas', label: `${query.parking}+ vagas`, patch: { parking: undefined } })
  if (query.areaMin || query.areaMax) {
    const label =
      query.areaMin && query.areaMax
        ? `${query.areaMin} a ${query.areaMax} m²`
        : query.areaMin
          ? `A partir de ${query.areaMin} m²`
          : `Até ${query.areaMax} m²`
    chips.push({ key: 'area', label, patch: { areaMin: undefined, areaMax: undefined } })
  }

  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="sr-only">Filtros aplicados:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.patch)}
          aria-label={`Remover filtro ${chip.label}`}
          className="group inline-flex h-8 animate-fade-in items-center gap-1.5 rounded-full border border-line bg-white pl-3.5 pr-2.5 text-[0.8125rem] text-graphite-700 transition-colors hover:border-ink hover:text-ink"
        >
          {chip.label}
          <X aria-hidden="true" className="size-3.5 text-graphite-400 group-hover:text-ink" strokeWidth={1.75} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-1 h-8 text-[0.8125rem] font-medium text-ink underline-offset-4 hover:underline"
      >
        Limpar tudo
      </button>
    </div>
  )
}
