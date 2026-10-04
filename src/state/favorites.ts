import { createContext, useContext } from 'react'

export interface FavoritesContextValue {
  ids: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string) => boolean
  clear: () => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites precisa estar dentro de <FavoritesProvider>.')
  return context
}
