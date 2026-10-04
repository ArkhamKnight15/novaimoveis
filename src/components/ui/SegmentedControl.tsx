import { useId, useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

export interface SegmentOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
  tone?: 'light' | 'dark' | 'glass'
  size?: 'sm' | 'md'
  hideLabel?: boolean
  className?: string
  block?: boolean
}

/** Grupo de opções exclusivas (radiogroup) com navegação por setas e indicador deslizante. */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  tone = 'light',
  size = 'md',
  hideLabel = true,
  className,
  block,
}: SegmentedControlProps<T>) {
  const labelId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return
    event.preventDefault()
    const next = (index + delta + options.length) % options.length
    const option = options[next]
    if (!option) return
    onChange(option.value)
    refs.current[next]?.focus()
  }

  return (
    <div className={cn(block && 'w-full', className)}>
      <span
        id={labelId}
        className={cn('mb-2 block text-[0.8125rem] font-medium text-graphite-700', hideLabel && 'sr-only')}
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={cn(
          'relative isolate grid rounded-[2px] p-1',
          tone === 'light' && 'bg-bone',
          tone === 'dark' && 'bg-white/10',
          tone === 'glass' && 'bg-ink/5',
          block ? 'w-full' : 'w-fit',
        )}
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-1 left-1 -z-10 rounded-[2px] shadow-panel transition-transform duration-500 ease-out-expo',
            tone === 'dark' ? 'bg-paper' : 'bg-white',
          )}
          style={{
            width: `calc((100% - 0.5rem) / ${options.length})`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
        {options.map((option, index) => {
          const checked = index === selectedIndex
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'whitespace-nowrap rounded-[2px] px-4 font-medium transition-colors duration-300',
                size === 'md' ? 'h-10 text-sm' : 'h-8 text-[0.8125rem]',
                checked
                  ? 'text-ink'
                  : tone === 'dark'
                    ? 'text-white/70 hover:text-white'
                    : 'text-graphite-500 hover:text-ink',
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
