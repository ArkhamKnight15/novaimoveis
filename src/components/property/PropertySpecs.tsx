import { Bath, BedDouble, CarFront, Ruler } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatArea } from '../../lib/format'
import type { Property } from '../../types/property'

interface PropertySpecsProps {
  property: Pick<Property, 'bedrooms' | 'suites' | 'bathrooms' | 'area' | 'parking'>
  className?: string
}

/** Quartos, banheiros, área e vagas em linha compacta, com rótulos completos para leitores de tela. */
export function PropertySpecs({ property, className }: PropertySpecsProps) {
  const items = [
    {
      icon: BedDouble,
      value: String(property.bedrooms),
      label:
        property.suites === property.bedrooms
          ? property.suites === 1
            ? 'suíte'
            : 'suítes'
          : property.bedrooms === 1
            ? 'quarto'
            : 'quartos',
    },
    { icon: Bath, value: String(property.bathrooms), label: property.bathrooms === 1 ? 'banheiro' : 'banheiros' },
    { icon: Ruler, value: formatArea(property.area), label: 'de área privativa', short: true },
    { icon: CarFront, value: String(property.parking), label: property.parking === 1 ? 'vaga' : 'vagas' },
  ]
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-graphite-500', className)}>
      {items.map(({ icon: Icon, value, label, short }) => (
        <li key={label} className="flex items-center gap-1.5">
          <Icon aria-hidden="true" className="size-4 text-graphite-400" strokeWidth={1.4} />
          <span className="tabular-nums text-graphite-700">{value}</span>
          <span className={cn(short && 'sr-only')}>{label}</span>
        </li>
      ))}
    </ul>
  )
}
