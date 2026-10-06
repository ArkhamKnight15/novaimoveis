import { useEffect, useRef, useState } from 'react'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Reveal } from '../../components/ui/Reveal'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { differentials } from '../../data/differentials'
import { cn } from '../../lib/cn'

/**
 * Seção editorial: título e imagem fixos à esquerda; à direita, os cinco diferenciais.
 * O diferencial que cruza o centro da tela fica em destaque e troca a imagem (crossfade).
 */
export function WhyNova() {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    itemRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const current = differentials[active]

  return (
    <section id="diferenciais" aria-labelledby="why-title" className="scroll-mt-0 bg-ink py-28 text-white lg:py-40">
      <Container className="lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <Reveal>
            <Eyebrow tone="light">Por que a NOVA</Eyebrow>
            <h2 id="why-title" className="font-display mt-6 text-display-lg text-white">
              Mais do que imóveis. <em className="text-gold-200">Encontramos o seu próximo endereço.</em>
            </h2>
          </Reveal>
          <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden bg-graphite-900 lg:block xl:aspect-[5/4]">
            {differentials.map((item, index) => (
              <ResponsiveImage
                key={item.id}
                image={item.image}
                sizes="40vw"
                alt={index === active ? item.image.alt : ''}
                aria-hidden={index !== active}
                className={cn(
                  'absolute inset-0 size-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out-expo',
                  index === active ? 'scale-100 !opacity-100' : 'scale-[1.06] !opacity-0',
                )}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 pt-16">
              <p className="font-editorial text-xl text-white">{current?.title}</p>
              <p className="eyebrow text-[0.625rem] tabular-nums text-white/60">
                {String(active + 1).padStart(2, '0')} / {String(differentials.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
          {differentials.map((item, index) => (
            <li
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              data-index={index}
              onPointerEnter={() => setActive(index)}
              className="grid grid-cols-[3rem_1fr] border-t border-white/10 py-10 last:border-b sm:grid-cols-[5rem_1fr] lg:py-16"
            >
              <span aria-hidden="true" className="font-mono pt-2 text-sm tabular-nums text-gold-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Reveal>
                <h3
                  className={cn(
                    'font-display text-display-md transition-colors duration-700',
                    index === active ? 'text-white' : 'text-white lg:text-white/45',
                  )}
                >
                  {item.title}
                </h3>
                <p className="mt-4 text-lg text-white/80">{item.description}</p>
                <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-white/60">{item.detail}</p>
                <div className="mt-8 aspect-[16/10] overflow-hidden bg-graphite-900 lg:hidden">
                  <ResponsiveImage image={item.image} sizes="90vw" className="size-full object-cover" />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
