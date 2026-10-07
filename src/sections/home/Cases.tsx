import { useState } from 'react'
import { BeforeAfter } from '../../components/ui/BeforeAfter'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Tabs } from '../../components/ui/Tabs'
import { caseStudies } from '../../data/cases'

export function Cases() {
  const [activeId, setActiveId] = useState(caseStudies[0]?.id ?? '')
  const active = caseStudies.find((item) => item.id === activeId) ?? caseStudies[0]
  if (!active) return null

  return (
    <section aria-labelledby="cases-title" className="bg-ink py-28 text-white lg:py-40">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="cases-title"
            tone="light"
            eyebrow="Cases"
            title={
              <>
                Transformações que <span className="text-gold-200">valorizam</span>
              </>
            }
            description="Reforma, arquitetura e curadoria visual: arraste o controle para comparar o antes e o depois de projetos que conduzimos."
          />
          <Reveal delay={120}>
            <Tabs
              label="Escolha um case"
              idPrefix="cases"
              items={caseStudies.map((item) => ({ id: item.id, label: item.category }))}
              value={active.id}
              onChange={setActiveId}
            />
          </Reveal>
        </div>

        <Reveal
          id="cases-panel"
          role="tabpanel"
          aria-labelledby={`cases-tab-${active.id}`}
          className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12"
        >
          <div key={active.id} className="animate-fade-in lg:col-span-8">
            <BeforeAfter before={active.before} after={active.after} sizes="(min-width: 1024px) 62vw, 100vw" />
          </div>
          <div key={`${active.id}-text`} className="flex animate-page-in flex-col lg:col-span-4">
            <p className="eyebrow text-[0.625rem] text-gold-300">{active.category}</p>
            <h3 className="font-editorial mt-4 text-3xl leading-tight text-white">{active.title}</h3>
            <p className="mt-2 text-sm text-white/55">{active.location}</p>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/70">{active.summary}</p>

            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {active.metrics.map((metric) => (
                <div key={metric.label} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4">
                  <dt className="text-[0.8125rem] text-white/55">{metric.label}</dt>
                  <dd className="flex items-baseline gap-3 text-sm tabular-nums">
                    <span className="text-white/60 line-through decoration-white/40">{metric.before}</span>
                    <span aria-hidden="true" className="text-white/30">
                      →
                    </span>
                    <span className="sr-only">depois:</span>
                    <span className="font-medium text-white">{metric.after}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-end gap-4 lg:mt-auto lg:pt-10">
              <p className="font-display text-6xl font-[300] leading-none text-gold-300">{active.result}</p>
              <p className="pb-1 text-[0.8125rem] leading-snug text-white/60">{active.duration}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
