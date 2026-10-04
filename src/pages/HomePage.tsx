import { usePageMeta } from '../hooks/usePageMeta'
import { About } from '../sections/home/About'
import { Brokers } from '../sections/home/Brokers'
import { Cases } from '../sections/home/Cases'
import { Faq } from '../sections/home/Faq'
import { FeaturedProperties } from '../sections/home/FeaturedProperties'
import { FinalCta } from '../sections/home/FinalCta'
import { Hero } from '../sections/home/Hero'
import { Process } from '../sections/home/Process'
import { Testimonials } from '../sections/home/Testimonials'
import { TrustBar } from '../sections/home/TrustBar'
import { WhyNova } from '../sections/home/WhyNova'

export function HomePage() {
  usePageMeta({
    title: 'NOVA Imóveis | Imóveis de alto padrão selecionados',
    description:
      'Casas, apartamentos e coberturas de alto padrão selecionados pela NOVA Imóveis. Busque por localização, agende visitas e fale com especialistas locais.',
    path: '/',
  })
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProperties />
      <WhyNova />
      <About />
      <Process />
      <Cases />
      <Brokers />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  )
}
