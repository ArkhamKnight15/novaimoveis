import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  value: string
  label: string
  /** Texto auxiliar à direita (ex.: quantidade de imóveis). */
  hint?: string
  /** Agrupa opções sob um título (ex.: "Cidades", "Bairros"). */
  group?: string
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Texto exibido quando `value` não corresponde a nenhuma opção. */
  placeholder?: string
  /**
   * hero: célula da busca do hero (rótulo pequeno + valor).
   * field: campo de formulário com borda.
   * inline: compacto, para ordenação.
   */
  variant?: 'hero' | 'field' | 'inline'
  className?: string
  id?: string
  /** Esconde o rótulo visualmente (mantém para leitores de tela). */
  hideLabel?: boolean
}

/**
 * Select acessível no padrão "select-only combobox" da WAI-ARIA:
 * setas, Home/End, Enter/Espaço, Esc, digitação para buscar e clique fora para fechar.
 */
export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecione',
  variant = 'field',
  className,
  id,
  hideLabel,
}: SelectProps) {
  const autoId = useId()
  const baseId = id ?? autoId
  const labelId = `${baseId}-label`
  const listId = `${baseId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]

  const groups = useMemo(() => {
    const result: { name?: string; items: { option: SelectOption; index: number }[] }[] = []
    options.forEach((option, index) => {
      const last = result[result.length - 1]
      if (last && last.name === option.group) last.items.push({ option, index })
      else result.push({ name: option.group, items: [{ option, index }] })
    })
    return result
  }, [options])

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  function close(focusButton = true) {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  function choose(index: number) {
    const option = options[index]
    if (option) onChange(option.value)
    close()
  }

  // Decide se a lista abre para baixo ou para cima conforme o espaço disponível.
  useLayoutEffect(() => {
    if (!open || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    setPlacement(spaceBelow < 320 && rect.top > spaceBelow ? 'top' : 'bottom')
    listRef.current?.focus({ preventScroll: true })
  }, [open])

  // Mantém a opção ativa visível ao navegar pelo teclado.
  useEffect(() => {
    if (!open) return
    document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, baseId])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openList()
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(last, index + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(0, index - 1))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        close()
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const state = typeahead.current
          window.clearTimeout(state.timer)
          state.text += event.key.toLowerCase()
          state.timer = window.setTimeout(() => (state.text = ''), 600)
          const match = options.findIndex((option) =>
            option.label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().startsWith(state.text),
          )
          if (match >= 0) setActiveIndex(match)
        }
    }
  }

  const display = selected?.label ?? placeholder

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <span
        id={labelId}
        className={cn(
          variant === 'hero' && 'eyebrow block text-[0.625rem] text-graphite-500',
          variant === 'field' && 'mb-2 block text-[0.8125rem] font-medium text-graphite-700',
          variant === 'inline' && 'sr-only',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${baseId}-value`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKeyDown}
        className={cn(
          'group flex w-full items-center justify-between gap-3 text-left transition-colors duration-300',
          variant === 'hero' && 'mt-2 text-[0.9375rem] text-ink',
          variant === 'field' &&
            'h-12 rounded-[2px] border border-line bg-white px-4 text-[0.9375rem] text-ink hover:border-graphite-300 aria-expanded:border-ink',
          variant === 'inline' && 'h-10 gap-2 text-sm text-ink',
        )}
      >
        <span id={`${baseId}-value`} className={cn('truncate', !selected && 'text-graphite-500')}>
          {display}
        </span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn(
            'size-4 shrink-0 text-graphite-500 transition-transform duration-300 ease-out-expo',
            open && 'rotate-180',
          )}
        />
      </button>
      {/* Padrão "select-only combobox" da WAI-ARIA: o teclado é tratado no listbox (aria-activedescendant). */}
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${baseId}-option-${activeIndex}` : undefined}
        onKeyDown={onListKeyDown}
        hidden={!open}
        className={cn(
          'absolute z-50 max-h-80 min-w-full overflow-y-auto overscroll-contain rounded-[2px] border border-line bg-white py-2 shadow-float outline-none animate-fade-in',
          variant === 'hero' ? '-left-4 w-[calc(100%+2rem)]' : 'left-0',
          variant === 'inline' && 'right-0 left-auto w-56',
          placement === 'bottom' ? 'top-[calc(100%+0.75rem)]' : 'bottom-[calc(100%+0.75rem)]',
        )}
      >
        {groups.map((group, groupIndex) => (
          <li key={group.name ?? groupIndex} role="presentation">
            {group.name && (
              <span className="eyebrow block px-4 pb-2 pt-3 text-[0.625rem] text-graphite-500">{group.name}</span>
            )}
            <ul role="group" aria-label={group.name}>
              {group.items.map(({ option, index }) => {
                const isSelected = index === selectedIndex
                return (
                  <li
                    key={option.value}
                    id={`${baseId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onPointerMove={() => setActiveIndex(index)}
                    onClick={() => choose(index)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-[0.9375rem] text-graphite-700 transition-colors duration-150',
                      index === activeIndex && 'bg-bone text-ink',
                      isSelected && 'text-ink',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Check
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className={cn('size-3.5 text-gold-600', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      {option.label}
                    </span>
                    {option.hint && <span className="text-xs tabular-nums text-graphite-500">{option.hint}</span>}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
