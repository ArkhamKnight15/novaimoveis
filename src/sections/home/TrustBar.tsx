import { Container } from '../../components/ui/Container'
import { trustStats } from '../../data/stats'
import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'
import { formatNumber } from '../../lib/format'
import type { Stat } from '../../types/content'

function StatItem({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const value = useCountUp(stat.value, active, 1400 + index * 200)
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 py-8 sm:items-center sm:text-center lg:py-2',
        index % 2 === 1 && 'border-l border-line pl-6 sm:pl-0',
        index >= 2 && 'border-t border-line lg:border-t-0',
        index > 0 && 'lg:border-l',
      )}
    >
      <p className="font-display text-[clamp(2.75rem,2rem+2.2vw,4.25rem)] font-[300] leading-none text-ink">
        <span aria-hidden="true">
          {stat.prefix && <span className="text-gold-500">{stat.prefix}</span>}
          <span className="tabular-nums">{formatNumber(value)}</span>
          {stat.suffix && <span className="text-gold-500">{stat.suffix}</span>}
        </span>
        <span className="sr-only">
          {stat.prefix === '+' ? 'Mais de ' : ''}
          {formatNumber(stat.value)}
          {stat.suffix ?? ''}
        </span>
      </p>
      <p className="eyebrow text-[0.625rem] leading-relaxed text-graphite-500">{stat.label}</p>
    </div>
  )
}

/** Números de confiança logo abaixo do hero, com contagem animada ao entrar na tela. */
export function TrustBar() {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -15% 0px' })
  return (
    <section aria-label="A NOVA em números" className="border-b border-line bg-paper pb-14 pt-10 lg:py-24">
      <Container>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} active={inView} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}
