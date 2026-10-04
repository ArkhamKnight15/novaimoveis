import { useEffect } from 'react'

let locks = 0

/**
 * Trava a rolagem da página enquanto `active` for true (suporta várias camadas abertas).
 * O `scrollbar-gutter: stable` do <html> evita o salto de layout ao esconder a barra.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks += 1
    document.documentElement.style.overflow = 'hidden'
    return () => {
      locks -= 1
      if (locks === 0) document.documentElement.style.overflow = ''
    }
  }, [active])
}
