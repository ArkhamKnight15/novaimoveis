import { useSyncExternalStore } from 'react'

/** `true` quando a página foi rolada além de `threshold` pixels. */
export function useScrolled(threshold = 24): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true })
      return () => window.removeEventListener('scroll', onChange)
    },
    () => window.scrollY > threshold,
    () => false,
  )
}
