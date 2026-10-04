import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TabsProps<T extends string> {
  label: string
  items: { id: T; label: ReactNode }[]
  value: T
  onChange: (value: T) => void
  /** Prefixo dos ids de aba/painel para aria-controls. */
  idPrefix: string
  tone?: 'dark' | 'light'
  className?: string
}

/** Lista de abas (WAI-ARIA tabs) com ativação automática pelas setas. */
export function Tabs<T extends string>({
  label,
  items,
  value,
  onChange,
  idPrefix,
  tone = 'dark',
  className,
}: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, Home: -index, End: items.length - 1 - index }
    const delta = map[event.key]
    if (delta === undefined) return
    event.preventDefault()
    const next = (index + delta + items.length) % items.length
    const item = items[next]
    if (!item) return
    onChange(item.id)
    refs.current[next]?.focus()
  }

  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-6 sm:gap-8', className)}>
      {items.map((item, index) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            id={`${idPrefix}-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'relative pb-3 text-sm font-medium transition-colors duration-300',
              'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:transition-transform after:duration-500 after:ease-out-expo',
              tone === 'dark' ? 'after:bg-gold-300' : 'after:bg-ink',
              selected ? 'after:scale-x-100' : 'after:scale-x-0',
              tone === 'dark'
                ? selected
                  ? 'text-white'
                  : 'text-white/55 hover:text-white'
                : selected
                  ? 'text-ink'
                  : 'text-graphite-500 hover:text-ink',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
