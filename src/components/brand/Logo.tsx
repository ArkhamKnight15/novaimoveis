import { cn } from '../../lib/cn'

interface LogoProps {
  className?: string
  /** Mostra "Imóveis" ao lado do monograma. */
  withTagline?: boolean
  /** Uso puramente gráfico (ex.: assinatura no rodapé): oculto para leitores de tela. */
  decorative?: boolean
}

/**
 * Logotipo NOVA: letras de traço fino, com o "A" sem travessão (Λ) espelhando o "V"
 * como um telhado — vale e cumeeira, a casa e o horizonte.
 */
export function Logo({ className, withTagline, decorative }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 100 24"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : 'NOVA Imóveis'}
        aria-hidden={decorative || undefined}
        className="h-[1.05em] w-auto overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.1}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M2 22V2l15.5 20V2" />
        <circle cx="36" cy="12" r="10" />
        <path d="M54 2l9 20 9-20" />
        <path d="M80 22l9-20 9 20" className={decorative ? undefined : 'text-gold-400'} stroke="currentColor" />
      </svg>
      {withTagline && (
        <span
          aria-hidden="true"
          className="eyebrow border-l border-current/25 pl-3 text-[0.5625rem] tracking-[0.32em] opacity-80"
        >
          Imóveis
        </span>
      )}
    </span>
  )
}
