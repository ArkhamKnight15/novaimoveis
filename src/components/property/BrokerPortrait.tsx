import { cn } from '../../lib/cn'
import { getInitials } from '../../lib/initials'
import type { Broker } from '../../types/content'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/**
 * Retrato 4:5 do corretor. Sem foto cadastrada, exibe um retrato gráfico com monograma
 * (claramente um espaço reservado), substituído automaticamente quando `photo` existir.
 */
export function BrokerPortrait({
  broker,
  className,
  sizes = '(min-width: 1024px) 22vw, 70vw',
}: {
  broker: Broker
  className?: string
  sizes?: string
}) {
  if (broker.photo) {
    return <ResponsiveImage image={broker.photo} sizes={sizes} className={cn('size-full object-cover', className)} />
  }
  return (
    <div
      role="img"
      aria-label={`Retrato de ${broker.name} em breve`}
      className={cn(
        '@container relative size-full overflow-hidden bg-gradient-to-b from-sand via-bone to-[#e9e2d6]',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
      >
        <path
          d="M60 500V230a140 140 0 0 1 280 0v270"
          fill="none"
          stroke="currentColor"
          className="text-gold-400/50"
          strokeWidth="1"
        />
        <path
          d="M100 500V250a100 100 0 0 1 200 0v250"
          fill="rgb(255 255 255 / 0.35)"
          stroke="currentColor"
          className="text-gold-400/30"
          strokeWidth="1"
        />
      </svg>
      <span className="font-display absolute inset-x-0 top-[44%] text-center text-[26cqw] font-[300] leading-none text-graphite-500">
        {getInitials(broker.name)}
      </span>
    </div>
  )
}
