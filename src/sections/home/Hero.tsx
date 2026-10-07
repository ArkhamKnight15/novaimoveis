import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { HeroSearch } from '../../components/search/HeroSearch'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { heroMedia } from '../../data/media'
import { useInquiry } from '../../state/inquiry'
import { HeroMedia } from './HeroMedia'

const lines = ['Encontre um lugar', 'que tenha a', 'sua cara.']

export function Hero() {
  const { openLead } = useInquiry()
  return (
    <section aria-labelledby="hero-title" className="relative z-10 text-white">
      <div className="relative isolate flex min-h-[max(40rem,92svh)] flex-col bg-ink lg:min-h-[max(46rem,100svh)]">
        <HeroMedia />
        {/* Véus: legibilidade do texto sem esconder o vídeo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-[5] bg-[linear-gradient(180deg,rgb(17_16_14/0.35)_0%,rgb(17_16_14/0)_28%,rgb(17_16_14/0)_45%,rgb(17_16_14/0.72)_100%),linear-gradient(90deg,rgb(17_16_14/0.45)_0%,rgb(17_16_14/0)_60%)]"
        />

        <Container className="flex flex-1 flex-col justify-end pb-24 pt-36 lg:pb-[11.5rem]">
          <p className="eyebrow flex animate-page-in items-center gap-3 text-gold-200 [animation-delay:80ms]">
            <span aria-hidden="true" className="h-px w-8 bg-gold-300" />
            Imóveis de alto padrão desde 2018
          </p>
          <h1
            id="hero-title"
            className="font-display mt-7 max-w-[13ch] text-display-2xl font-[300] text-white sm:max-w-[18ch]"
          >
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="block animate-rise" style={{ animationDelay: `${120 + index * 90}ms` }}>
                  {index === lines.length - 1 ? <span className="font-[300] text-gold-200">{line}</span> : line}
                </span>
              </span>
            ))}
          </h1>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-page-in [animation-delay:380ms]">
              <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                Imóveis selecionados para quem valoriza arquitetura, localização e qualidade de vida.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="light" size="lg" arrow onClick={openLead}>
                  Encontrar meu imóvel
                </Button>
                <ButtonLink to="/imoveis" variant="outline-light" size="lg">
                  Explorar imóveis
                </ButtonLink>
              </div>
            </div>
            <Link
              to={heroMedia.featured.to}
              className="group hidden animate-page-in items-center gap-3 text-[0.8125rem] text-white/70 transition-colors [animation-delay:500ms] hover:text-white md:flex"
            >
              <span className="eyebrow text-[0.5625rem] text-white/50">Na imagem</span>
              <span className="h-px w-6 bg-white/30" aria-hidden="true" />
              {heroMedia.featured.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </Container>

        <Container className="absolute inset-x-0 bottom-10 z-10 hidden animate-page-in [animation-delay:560ms] lg:block">
          <HeroSearch />
        </Container>
      </div>

      {/* Celular e tablet: a busca vira um cartão logo abaixo do hero */}
      <Container className="relative z-10 -mt-12 pb-4 lg:hidden">
        <HeroSearch />
      </Container>
    </section>
  )
}
