import { MapPin } from 'lucide-react'
import { BrokerPortrait } from '../../components/property/BrokerPortrait'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { brokers } from '../../data/brokers'
import { useInquiry } from '../../state/inquiry'

export function Brokers() {
  const { openMessage } = useInquiry()
  return (
    <section id="especialistas" aria-labelledby="brokers-title" className="py-28 lg:py-40">
      <Container>
        <SectionHeading
          id="brokers-title"
          eyebrow="Especialistas"
          title={
            <>
              Conheça nossos <em className="text-graphite-500">especialistas</em>
            </>
          }
          description="Consultores que moram e trabalham nas regiões que atendem. Fale direto com quem conhece cada rua."
        />
        <ul className="scrollbar-none -mx-5 mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 lg:mt-20 lg:grid-cols-4">
          {brokers.map((broker, index) => {
            const firstName = broker.name.split(' ')[0]
            return (
              <Reveal
                as="li"
                key={broker.id}
                delay={index * 90}
                className="w-[78%] shrink-0 snap-start sm:w-[45%] md:w-auto"
              >
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className="size-full transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]">
                      <BrokerPortrait broker={broker} />
                    </div>
                    <p className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 px-5 py-4 text-[0.8125rem] leading-relaxed text-white/80 backdrop-blur transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-within:translate-y-0">
                      {broker.bio}
                      <span className="mt-2 block text-[0.75rem] text-gold-200">{broker.languages.join(' · ')}</span>
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col pt-6">
                    <h3 className="font-display text-2xl">{broker.name}</h3>
                    <p className="mt-1.5 text-sm text-graphite-600">{broker.specialty}</p>
                    <p className="mt-4 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-graphite-500">
                      <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
                      {broker.region}
                    </p>
                    <p className="eyebrow mt-4 text-[0.5625rem] text-gold-700">
                      {broker.experience} anos de mercado · {broker.creci}
                    </p>
                    <div className="mt-auto pt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        block
                        onClick={() => openMessage(broker)}
                        aria-label={`Falar com ${broker.name}`}
                      >
                        Falar com {firstName}
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
