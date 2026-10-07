import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Reveal } from '../../components/ui/Reveal'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { aboutDetailImage, aboutImage } from '../../data/media'

const milestones = [
  { year: '2018', text: 'Fundação, com seis imóveis em carteira, no Jardim América.' },
  { year: '2020', text: 'Escritório no Rio de Janeiro e primeiras coberturas na orla.' },
  { year: '2022', text: 'Área de investimentos e parcerias com incorporadoras.' },
  { year: '2026', text: '42 pessoas atendendo 15 cidades, de Florianópolis a BH.' },
]

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="overflow-hidden py-28 lg:py-40">
      <Container className="grid items-center gap-20 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-7">
          <Reveal as="figure" className="relative aspect-[4/3] overflow-hidden bg-bone">
            <ResponsiveImage
              image={aboutImage}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="parallax-image size-full object-cover"
            />
          </Reveal>
          <Reveal
            as="figure"
            delay={200}
            className="absolute -bottom-14 right-0 hidden aspect-[4/5] w-[34%] overflow-hidden border-[10px] border-paper bg-bone sm:block lg:-right-8"
          >
            <ResponsiveImage image={aboutDetailImage} sizes="20vw" className="size-full object-cover" />
          </Reveal>
          <Reveal
            delay={320}
            className="absolute -bottom-10 left-0 bg-ink px-7 py-6 text-paper sm:left-6 sm:px-9 sm:py-8"
          >
            <p className="font-display text-4xl font-[300] sm:text-5xl">
              R$ 4,2 <span className="text-gold-300">bi</span>
            </p>
            <p className="eyebrow mt-3 text-[0.5625rem] text-white/60">em imóveis negociados desde 2018</p>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal>
            <Eyebrow>Sobre a NOVA</Eyebrow>
            <h2 id="about-title" className="font-display mt-6 text-display-lg">
              Pequena por escolha. <span className="text-graphite-500">Grande no que entrega.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 space-y-5 text-[0.9375rem] leading-relaxed text-graphite-500">
            <p>
              A NOVA nasceu em 2018, em uma sala no Jardim América, do incômodo de duas pessoas com o mercado: anúncios
              repetidos, fotos que não correspondiam ao imóvel e visitas que não levavam a lugar nenhum.
            </p>
            <p>
              Marina Costa, arquiteta, e Henrique Lobo, economista vindo do mercado financeiro, decidiram fazer o
              contrário. Um portfólio enxuto, imóveis visitados um a um e um único especialista acompanhando cada
              cliente do primeiro café à entrega das chaves.
            </p>
            <p>
              Oito anos depois, a carteira cresceu, a tecnologia também, mas o critério continua o mesmo: só mostramos o
              que gostaríamos de comprar.
            </p>
          </Reveal>
          <Reveal delay={160} className="mt-8 border-t border-line pt-6">
            <p className="font-editorial text-xl text-ink">Marina Costa & Henrique Lobo</p>
            <p className="mt-1 text-[0.8125rem] text-graphite-500">Fundadores da NOVA</p>
          </Reveal>
        </div>

        <Reveal as="div" className="lg:col-span-12 lg:mt-16">
          <ol className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone) => (
              <li key={milestone.year} className="bg-paper py-8 sm:px-6 lg:first:pl-0">
                <p className="font-display text-3xl text-ink">{milestone.year}</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite-500">{milestone.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  )
}
