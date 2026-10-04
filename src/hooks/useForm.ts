import { useCallback, useRef, useState } from 'react'

export type Rules<T> = Partial<{ [K in keyof T]: (value: T[K], values: T) => string | undefined }>
export type Errors<T> = Partial<Record<keyof T, string>>

/**
 * Estado de formulário com validação no blur (após o primeiro toque) e no envio,
 * levando o foco ao primeiro campo inválido (elementos marcados com `data-field`).
 */
export function useForm<T extends object>(initial: T, rules: Rules<T>) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Errors<T>>({})
  const valuesRef = useRef(initial)
  const touchedRef = useRef<Partial<Record<keyof T, boolean>>>({})

  const check = useCallback((key: keyof T, current: T) => rules[key]?.(current[key], current), [rules])

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const next = { ...valuesRef.current, [key]: value }
      valuesRef.current = next
      setValues(next)
      if (touchedRef.current[key]) setErrors((current) => ({ ...current, [key]: check(key, next) }))
    },
    [check],
  )

  const blur = useCallback(
    (key: keyof T) => {
      touchedRef.current[key] = true
      setErrors((current) => ({ ...current, [key]: check(key, valuesRef.current) }))
    },
    [check],
  )

  /** Valida os campos informados (ou todos); devolve true se não houver erros. */
  const validateFields = useCallback(
    (keys: (keyof T)[] = Object.keys(rules) as (keyof T)[]) => {
      const found: Errors<T> = {}
      for (const key of keys) {
        touchedRef.current[key] = true
        const error = check(key, valuesRef.current)
        if (error) found[key] = error
      }
      setErrors((current) => {
        const next = { ...current }
        for (const key of keys) next[key] = found[key]
        return next
      })
      const first = keys.find((key) => found[key])
      if (first !== undefined) {
        requestAnimationFrame(() => {
          document.querySelector<HTMLElement>(`[data-field="${String(first)}"]`)?.focus()
        })
      }
      return first === undefined
    },
    [rules, check],
  )

  return { values, errors, setValue, blur, validateFields }
}

export type SubmitState<R> =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; result: R }
  | { status: 'error'; message: string }
