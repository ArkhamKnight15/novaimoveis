import { useId } from 'react'
import { cn } from '../../lib/cn'

interface ChipGroupProps<T extends string> {
  label: string
  options: { value: T; label: string }[]
  /** Valor selecionado; clicar novamente desmarca. */
  value: T | undefined
  onChange: (value: T | undefined) => void
  hideLabel?: boolean
  className?: string
}

/** Chips de seleção única que podem ser desmarcados (filtros opcionais). */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  hideLabel,
  className,
}: ChipGroupProps<T>) {
  const labelId = useId()
  return (
    <div role="group" aria-labelledby={labelId} className={className}>
      <span
        id={labelId}
        className={cn('mb-3 block text-[0.8125rem] font-medium text-graphite-700', hideLabel && 'sr-only')}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? undefined : option.value)}
              className={cn(
                'h-9 rounded-full border px-4 text-[0.8125rem] transition-[background-color,border-color,color] duration-300',
                active
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-white text-graphite-600 hover:border-graphite-300 hover:text-ink',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
