import { useId, useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

export interface Choice {
  value: string
  label: string
  sublabel?: string
  disabled?: boolean
}

interface ChoiceGridProps {
  label: string
  choices: Choice[]
  value: string
  onChange: (value: string) => void
  error?: string
  columns?: string
  name: string
}

/** Grade de opções exclusivas (radiogroup) — datas e horários de visita. */
export function ChoiceGrid({ label, choices, value, onChange, error, columns = 'grid-cols-3', name }: ChoiceGridProps) {
  const labelId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const enabled = choices.filter((choice) => !choice.disabled)
  const focusIndex = Math.max(
    0,
    choices.findIndex((choice) => choice.value === (value || enabled[0]?.value)),
  )

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    const delta = keys[event.key]
    if (!delta) return
    event.preventDefault()
    let next = index
    do {
      next = (next + delta + choices.length) % choices.length
    } while (choices[next]?.disabled && next !== index)
    const choice = choices[next]
    if (!choice) return
    onChange(choice.value)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <span id={labelId} className="mb-3 block text-[0.8125rem] font-medium text-graphite-700">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={error ? `${labelId}-error` : undefined}
        className={cn('grid gap-2', columns)}
      >
        {choices.map((choice, index) => {
          const checked = choice.value === value
          return (
            <button
              key={choice.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={choice.disabled}
              data-field={index === focusIndex ? name : undefined}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => onChange(choice.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'flex min-h-12 flex-col items-center justify-center rounded-[2px] border px-2 py-2 text-center transition-[background-color,border-color,color] duration-300 disabled:cursor-not-allowed disabled:opacity-35',
                checked
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-white text-graphite-700 hover:border-graphite-300 hover:text-ink',
              )}
            >
              {choice.sublabel && (
                <span className={cn('eyebrow text-[0.5625rem]', checked ? 'text-white/70' : 'text-graphite-500')}>
                  {choice.sublabel}
                </span>
              )}
              <span className={cn('text-sm font-medium', choice.sublabel && 'mt-1')}>{choice.label}</span>
            </button>
          )
        })}
      </div>
      {error && (
        <p id={`${labelId}-error`} className="mt-2 text-[0.8125rem] text-danger-600">
          {error}
        </p>
      )}
    </div>
  )
}
