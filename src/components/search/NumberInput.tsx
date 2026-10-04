import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { formatNumber } from '../../lib/format'
import { TextField } from '../ui/Field'

interface NumberInputProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  prefix?: string
  suffix?: string
  placeholder?: string
}

/**
 * Campo numérico com separador de milhar ("1.500.000") que só confirma o valor
 * depois de uma pausa na digitação, evitando uma busca a cada tecla.
 */
export function NumberInput({ label, value, onChange, prefix, suffix, placeholder }: NumberInputProps) {
  const [draft, setDraft] = useState(value ? formatNumber(value) : '')
  const debounced = useDebouncedValue(draft, 500)

  // Sincroniza quando o valor muda por fora (ex.: "Limpar filtros").
  useEffect(() => {
    setDraft((current) => {
      const currentNumber = Number(current.replace(/\D/g, '')) || undefined
      return currentNumber === value ? current : value ? formatNumber(value) : ''
    })
  }, [value])

  useEffect(() => {
    const parsed = Number(debounced.replace(/\D/g, '')) || undefined
    if (parsed !== value) onChange(parsed)
    // `onChange` muda a cada render; só a digitação confirmada deve disparar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <TextField
      label={label}
      inputMode="numeric"
      autoComplete="off"
      prefix={prefix}
      suffix={suffix}
      placeholder={placeholder}
      value={draft}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, '').slice(0, 10)
        setDraft(digits ? formatNumber(Number(digits)) : '')
      }}
    />
  )
}
