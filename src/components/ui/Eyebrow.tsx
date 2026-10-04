import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface EyebrowProps {
  children: ReactNode
  tone?: 'dark' | 'light'
  className?: string
  /** Mostra o fio dourado antes do texto. */
  rule?: boolean
}

export function Eyebrow({ children, tone = 'dark', className, rule = true }: EyebrowProps) {
  return (
    <p
      className={cn('eyebrow flex items-center gap-3', tone === 'dark' ? 'text-gold-700' : 'text-gold-300', className)}
    >
      {rule && <span aria-hidden="true" className={cn('h-px w-8', tone === 'dark' ? 'bg-gold-500' : 'bg-gold-400')} />}
      {children}
    </p>
  )
}
