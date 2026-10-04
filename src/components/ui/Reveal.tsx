import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'li' | 'article' | 'figure' | 'span' | 'header' | 'section' | 'p'
  /** Atraso em milissegundos, para escalonar itens de uma lista. */
  delay?: number
  /** Deslocamento vertical inicial em pixels. */
  y?: number
}

/** Revela o conteúdo com fade + slide quando ele entra na viewport. */
export function Reveal({ as = 'div', delay = 0, y, className, style, ...props }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const Tag = as as ElementType
  const revealStyle = {
    '--reveal-delay': `${delay}ms`,
    ...(y !== undefined && { '--reveal-y': `${y}px` }),
    ...style,
  } as CSSProperties
  return <Tag ref={ref} data-visible={inView} className={cn('reveal', className)} style={revealStyle} {...props} />
}
