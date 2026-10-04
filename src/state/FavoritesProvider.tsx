import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FavoritesContext } from './favorites'

const STORAGE_KEY = 'nova:favoritos'

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

/** Favoritos persistidos no navegador e sincronizados entre abas. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStorage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Modo privado ou armazenamento cheio: os favoritos ficam apenas na sessão.
    }
  }, [ids])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setIds(readStorage())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  const toggle = useCallback(
    (id: string) => {
      const next = !ids.includes(id)
      setIds((current) =>
        next ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id),
      )
      return next
    },
    [ids],
  )

  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(() => ({ ids, isFavorite, toggle, clear }), [ids, isFavorite, toggle, clear])
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
