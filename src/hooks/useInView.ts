import { useEffect, useRef, useState } from 'react'

interface InViewOptions {
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/** Indica quando o elemento entra na viewport (por padrão, apenas a primeira vez). */
export function useInView<T extends Element>({
  once = true,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0,
}: InViewOptions = {}) {
  const ref = useRef<T>(null)
  // Sem suporte a IntersectionObserver, o conteúdo é exibido imediatamente.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView] as const
}
