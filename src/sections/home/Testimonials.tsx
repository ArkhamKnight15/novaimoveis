import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { IconButton } from '../../components/ui/IconButton'
import { Reveal } from '../../components/ui/Reveal'
import { StarRating } from '../../components/ui/StarRating'
import { Tabs } from '../../components/ui/Tabs'
import { testimonials } from '../../data/testimonials'
import { getInitials } from '../../lib/initials'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const active = testimonials[index]
  if (!active) return null
  const go = (delta: number) => setIndex((current) => (current + delta + testimonials.length) % testimonials.length)

  return (
    <section aria-labelledby="testimonials-title" className="bg-bone py-28 lg:py-40">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Depoimentos</Eyebrow>
          <h2 id="testimonials-title" className="font-display mt-6 text-display-lg">
            Histórias de quem encontrou <em className="text-graphite-500">o seu endereço</em>
          </h2>
          <div className="mt-10 flex items-center gap-5 border-t border-graphite-200 pt-8">
            <p className="font-display text-5xl font-[300] text-ink">4,9</p>
            <div>
              <StarRating value={5} />
              <p className="mt-2 text-[0.8125rem] text-graphite-500">Média de 312 avaliações de clientes</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
          <div id="testimonials-panel" role="tabpanel" aria-labelledby={`testimonials-tab-${active.id}`}>
            <figure key={active.id} className="min-h-[26rem] animate-page-in sm:min-h-[22rem]">
              <Quote aria-hidden="true" className="size-9 text-gold-500" strokeWidth={1} />
              <blockquote className="mt-6">
                <p className="font-display text-display-md text-ink">“{active.highlight}”</p>
                <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-graphite-500">{active.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="font-display flex size-12 items-center justify-center rounded-full bg-paper text-lg text-graphite-600 ring-1 ring-ink/5"
                >
                  {getInitials(active.name)}
                </span>
                <span>
                  <span className="block font-medium text-ink">{active.name}</span>
                  <span className="block text-[0.8125rem] text-graphite-500">{active.context}</span>
                </span>
                <StarRating value={active.rating} className="ml-auto hidden sm:flex" />
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 flex flex-col-reverse gap-6 border-t border-graphite-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              label="Escolha um depoimento"
              idPrefix="testimonials"
              tone="light"
              items={testimonials.map((item) => ({ id: item.id, label: item.name.split(' ')[0] }))}
              value={active.id}
              onChange={(id) => setIndex(testimonials.findIndex((item) => item.id === id))}
              className="gap-5 overflow-x-auto"
            />
            <div className="flex gap-2">
              <IconButton label="Depoimento anterior" onClick={() => go(-1)}>
                <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Próximo depoimento" tone="dark" onClick={() => go(1)}>
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </IconButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
