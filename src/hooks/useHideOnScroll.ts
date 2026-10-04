import { useEffect, useState } from 'react'

/** Esconde elementos fixos ao rolar para baixo e os revela ao rolar para cima. */
export function useHideOnScroll(offset = 480): boolean {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < offset) setHidden(false)
        else if (y > lastY + 6) setHidden(true)
        else if (y < lastY - 6) setHidden(false)
        lastY = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [offset])

  return hidden
}
