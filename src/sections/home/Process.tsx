import { Container } from '../../components/ui/Container'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { processSteps } from '../../data/process'
import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'

/** Linha do tempo do processo: o traço se desenha e cada etapa acende em sequência. */
export function Process() {
  const [ref, inView] = useInView<HTMLOListElement>({ rootMargin: '0px 0px -25% 0px' })
  return (
    <section aria-labelledby="process-title" className="bg-bone py-28 lg:py-40">
      <Container>
        <SectionHeading
          id="process-title"
          eyebrow="Experiência NOVA"
          title={
            <>
              Do primeiro clique <span className="text-graphite-500">às chaves na mão.</span>
            </>
          }
          description="Um processo claro, com um especialista dedicado do começo ao fim. Você sempre sabe em que etapa está."
        />

        <ol ref={ref} className="relative mt-20 grid gap-14 lg:mt-28 lg:grid-cols-4 lg:gap-10">
          {/* Trilho e progresso: vertical no celular, horizontal no desktop */}
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-7 top-8 w-px bg-graphite-200 lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-7 lg:h-px lg:w-auto"
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-8 left-7 top-8 w-px origin-top bg-ink transition-transform duration-[2200ms] ease-in-out-quart lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-7 lg:h-px lg:w-auto lg:origin-left',
              inView ? 'scale-100' : 'scale-y-0 lg:scale-x-0 lg:scale-y-100',
            )}
          />
          {processSteps.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                'relative grid grid-cols-[3.5rem_1fr] gap-6 transition-[opacity,transform] duration-700 ease-out-expo lg:block',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: `${index * 420}ms` }}
            >
              <span
                className={cn(
                  'font-mono relative z-10 flex size-14 items-center justify-center rounded-full border text-sm transition-[background-color,border-color,color] duration-700',
                  inView ? 'border-ink bg-ink text-paper' : 'border-graphite-300 bg-bone text-ink',
                )}
                style={{ transitionDelay: `${300 + index * 420}ms` }}
              >
                {index + 1}
                <span className="sr-only">ª etapa</span>
              </span>
              <div className="lg:mt-10 lg:pr-6">
                <h3 className="font-editorial text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-graphite-500">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
