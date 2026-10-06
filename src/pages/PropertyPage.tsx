import { CalendarDays, Check, MapPin, MessageCircle, Share2 } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router'
import { VisitForm } from '../components/forms/VisitForm'
import { AmenityList } from '../components/property/AmenityList'
import { BrokerAvatar } from '../components/property/BrokerAvatar'
import { BrokerCard } from '../components/property/BrokerCard'
import { FavoriteButton } from '../components/property/FavoriteButton'
import { LocationMap } from '../components/property/LocationMap'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyGallery } from '../components/property/PropertyGallery'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Skeleton } from '../components/ui/Skeleton'
import { badgeLabels, propertyTypeLabels, purposeLabels } from '../data/catalog'
import { getBroker } from '../data/brokers'
import { company } from '../data/company'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatArea, formatCurrency, formatPrice } from '../lib/format'
import { purposePaths } from '../lib/filters'
import { getPropertyBySlug, getSimilarProperties } from '../services/properties'
import { useInquiry } from '../state/inquiry'
import { useToast } from '../state/toast'
import type { Property } from '../types/property'
import { NotFoundPage } from './NotFoundPage'

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <Reveal
      as="section"
      aria-labelledby={id ? `${id}-title` : undefined}
      className="border-t border-line py-12 lg:py-16"
    >
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-display-md">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </Reveal>
  )
}

function KeyFacts({ property }: { property: Property }) {
  const facts = [
    { label: 'Tipo', value: propertyTypeLabels[property.type] },
    {
      label: 'Quartos',
      value: property.suites
        ? `${property.bedrooms} (${property.suites} ${property.suites === 1 ? 'suíte' : 'suítes'})`
        : String(property.bedrooms),
    },
    { label: 'Banheiros', value: String(property.bathrooms) },
    { label: 'Área privativa', value: formatArea(property.area) },
    { label: 'Vagas', value: String(property.parking) },
    ...(property.lotArea ? [{ label: 'Terreno', value: formatArea(property.lotArea) }] : []),
  ]
  return (
    <dl className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 xl:grid-cols-6">
      {facts.map((fact) => (
        <div key={fact.label} className="border-b border-r border-line px-5 py-5">
          <dt className="eyebrow text-[0.5625rem] text-graphite-500">{fact.label}</dt>
          <dd className="font-editorial mt-2.5 text-xl text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function CondoDetails({ property }: { property: Property }) {
  const { condo } = property
  const rows = [
    {
      label: property.purpose === 'aluguel' ? 'Aluguel' : 'Valor de venda',
      value: formatPrice(property.price, property.purpose),
    },
    ...(property.condoFee ? [{ label: 'Condomínio', value: `${formatCurrency(property.condoFee)}/mês` }] : []),
    ...(property.iptu ? [{ label: 'IPTU', value: `${formatCurrency(property.iptu)}/ano` }] : []),
    ...(condo.name ? [{ label: 'Edifício / condomínio', value: condo.name }] : []),
    {
      label: property.badge === 'lancamento' ? 'Previsão de entrega' : 'Ano de construção',
      value: String(condo.yearBuilt),
    },
    ...(condo.floor ? [{ label: 'Andar', value: `${condo.floor}º de ${condo.totalFloors ?? '—'}` }] : []),
    ...(condo.unitsPerFloor ? [{ label: 'Unidades por andar', value: String(condo.unitsPerFloor) }] : []),
    { label: 'Mobiliado', value: condo.furnished ? 'Sim' : 'Não' },
    { label: 'Aceita pets', value: condo.petFriendly ? 'Sim' : 'Não' },
  ]
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 py-3.5 text-[0.9375rem]">
            <dt className="text-graphite-500">{row.label}</dt>
            <dd className="text-right font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <h3 className="eyebrow text-[0.625rem] text-graphite-500">Infraestrutura</h3>
        <ul className="mt-5 space-y-3">
          {condo.services.map((service) => (
            <li key={service} className="flex gap-3 text-[0.9375rem] text-graphite-700">
              <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
              {service}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PropertySkeleton() {
  return (
    <Container className="pb-24 pt-32" aria-hidden="true">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-8 h-12 w-2/3" />
      <Skeleton className="mt-4 h-4 w-1/3" />
      <Skeleton className="mt-10 aspect-[16/10] w-full lg:w-2/3" />
    </Container>
  )
}

/** Dados estruturados (schema.org) para mecanismos de busca. */
function StructuredData({ property }: { property: Property }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.headline,
    url: `${company.siteUrl}/imoveis/${property.slug}`,
    image: property.images.map((image) => `${company.siteUrl}${image.src}`),
    datePosted: property.publishedAt,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'BRL',
      businessFunction:
        property.purpose === 'aluguel'
          ? 'http://purl.org/goodrelations/v1#LeaseOut'
          : 'http://purl.org/goodrelations/v1#Sell',
    },
    about: {
      '@type': property.type.startsWith('casa') ? 'SingleFamilyResidence' : 'Apartment',
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location.city,
        addressRegion: property.location.state,
        addressCountry: 'BR',
      },
    },
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export function PropertyPage() {
  const { slug = '' } = useParams()
  const { status, data: property, retry } = useAsync((signal) => getPropertyBySlug(slug, signal), [slug])

  if (status === 'error') {
    return (
      <Container className="flex min-h-[70svh] flex-col items-start justify-center gap-5 pt-24">
        <h1 className="font-display text-display-md">Não foi possível carregar este imóvel</h1>
        <Button variant="outline" onClick={retry}>
          Tentar novamente
        </Button>
      </Container>
    )
  }
  if (status === 'loading' || property === undefined) return <PropertySkeleton />
  if (property === null)
    return (
      <NotFoundPage
        title="Imóvel não encontrado"
        description="Este imóvel pode ter sido vendido ou retirado do portfólio. Veja outras opções selecionadas pela NOVA."
      />
    )
  return <PropertyDetails key={property.id} property={property} />
}

function PropertyDetails({ property }: { property: Property }) {
  const broker = getBroker(property.brokerId)
  const { openVisit, openMessage } = useInquiry()
  const toast = useToast()
  const similar = useAsync((signal) => getSimilarProperties(property, 3, signal), [property.id])
  const purpose = purposeLabels[property.purpose]

  // Reserva espaço no fim da página para a barra fixa de ação (celular e tablet).
  useEffect(() => {
    document.body.classList.add('has-action-bar')
    return () => document.body.classList.remove('has-action-bar')
  }, [])

  usePageMeta({
    title: `${property.title}, ${property.location.neighborhood}`,
    description: `${property.headline}. ${property.category} com ${formatArea(property.area)} em ${property.location.neighborhood}, ${property.location.city}. ${formatPrice(property.price, property.purpose)}.`,
    image: property.images[0]?.src,
    path: `/imoveis/${property.slug}`,
  })

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, text: property.headline, url })
      } catch {
        // Compartilhamento cancelado pelo usuário.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      toast({ title: 'Link copiado', description: 'Cole onde quiser para compartilhar este imóvel.', tone: 'success' })
    } catch {
      toast({ title: 'Não foi possível copiar o link', description: url })
    }
  }

  return (
    <>
      <StructuredData property={property} />
      <Container className="pt-28 lg:pt-32">
        <nav aria-label="Trilha de navegação" className="text-[0.8125rem] text-graphite-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-ink">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={purposePaths[property.purpose]} className="transition-colors hover:text-ink">
                {property.purpose === 'venda' ? 'Comprar' : 'Alugar'}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {property.title}
            </li>
          </ol>
        </nav>

        <header className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>
                {property.category} · {purpose.noun}
              </Eyebrow>
              {property.badge && (
                <span className="eyebrow rounded-[2px] bg-ink px-2.5 py-1.5 text-[0.5625rem] text-gold-200">
                  {badgeLabels[property.badge]}
                </span>
              )}
            </div>
            <h1 className="font-display mt-5 text-display-xl">{property.title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] text-graphite-500">
              <span className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} />
                {property.location.neighborhood}, {property.location.city} – {property.location.state}
              </span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-graphite-200 sm:block" />
              <span className="font-mono">Cód. {property.id}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <FavoriteButton property={property} variant="outline" />
            <button
              type="button"
              onClick={() => void share()}
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line px-5 text-[0.8125rem] font-medium text-graphite-700 transition-colors hover:border-ink hover:text-ink"
            >
              <Share2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
              Compartilhar
            </button>
          </div>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="min-w-0 lg:col-span-8">
            <PropertyGallery images={property.images} title={property.title} />

            <div className="mt-12">
              <KeyFacts property={property} />
            </div>

            <Section id="sobre-imovel" title="Sobre o imóvel">
              <p className="font-editorial text-2xl leading-snug text-graphite-700">{property.headline}.</p>
              <div className="mt-6 max-w-3xl space-y-5 text-[0.9375rem] leading-relaxed text-graphite-500 sm:text-base">
                {property.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {property.architect && (
                <p className="eyebrow mt-8 text-[0.625rem] text-gold-700">Projeto · {property.architect}</p>
              )}
            </Section>

            <Section id="caracteristicas" title="Características">
              <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex gap-3 border-b border-line pb-4 text-[0.9375rem] text-graphite-700">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-gold-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="comodidades" title="Comodidades">
              <AmenityList amenities={property.amenities} />
            </Section>

            <Section id="condominio" title="Condomínio e valores">
              <CondoDetails property={property} />
            </Section>

            <Section id="localizacao" title="Localização">
              <LocationMap property={property} />
              <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {property.nearby.map((place) => (
                  <li
                    key={place.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-[0.9375rem]"
                  >
                    <span className="text-graphite-700">{place.label}</span>
                    <span className="shrink-0 text-[0.8125rem] text-graphite-500">{place.distance}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {broker && (
              <Section id="corretor" title="Corretor responsável">
                <BrokerCard broker={broker} onMessage={() => openMessage(broker, property)} />
              </Section>
            )}

            <Section id="agendar" title="Agende sua visita">
              <p className="-mt-2 mb-8 max-w-xl text-[0.9375rem] leading-relaxed text-graphite-500">
                Escolha o dia e o horário. Um especialista acompanha você e responde às dúvidas no local.
              </p>
              <div className="border border-line bg-white p-5 sm:p-8">
                <VisitForm property={property} />
              </div>
            </Section>
          </div>

          <aside aria-label="Resumo e contato" className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 border border-line bg-white p-7 shadow-panel xl:p-8">
              <p className="eyebrow text-[0.625rem] text-graphite-500">{purpose.noun}</p>
              <p className="font-display mt-3 text-4xl text-ink">{formatPrice(property.price, property.purpose)}</p>
              <dl className="mt-5 space-y-2 text-[0.8125rem] text-graphite-500">
                {property.condoFee && (
                  <div className="flex justify-between">
                    <dt>Condomínio</dt>
                    <dd className="text-graphite-700">{formatCurrency(property.condoFee)}/mês</dd>
                  </div>
                )}
                {property.iptu && (
                  <div className="flex justify-between">
                    <dt>IPTU</dt>
                    <dd className="text-graphite-700">{formatCurrency(property.iptu)}/ano</dd>
                  </div>
                )}
              </dl>
              <div className="mt-7 space-y-3">
                <Button
                  variant="solid"
                  size="lg"
                  block
                  onClick={() => openVisit(property)}
                  icon={<CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.5} />}
                >
                  Agendar visita
                </Button>
                {broker && (
                  <Button
                    variant="outline"
                    size="lg"
                    block
                    onClick={() => openMessage(broker, property)}
                    icon={<MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} />}
                  >
                    Falar com o corretor
                  </Button>
                )}
              </div>
              {broker && (
                <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                  <BrokerAvatar broker={broker} className="size-11 text-sm" />
                  <div className="text-[0.8125rem]">
                    <p className="font-medium text-ink">{broker.name}</p>
                    <p className="text-graphite-500">Responde em até 2 horas úteis</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>

      {similar.data && similar.data.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-12 bg-bone py-24 lg:py-32">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 id="similar-title" className="font-display text-display-lg">
                Você também pode gostar
              </h2>
              <Link
                to={purposePaths[property.purpose]}
                className="link-underline hidden pb-1 text-sm font-medium text-ink sm:block"
              >
                Ver mais imóveis
              </Link>
            </div>
            <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {similar.data.map((item) => (
                <li key={item.id} className="flex">
                  <PropertyCard property={item} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Barra fixa de ação no celular e tablet */}
      {createPortal(
        <aside
          aria-label="Ações rápidas do imóvel"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden"
        >
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[0.5625rem] text-graphite-500">{purpose.noun}</p>
              <p className="font-editorial mt-1 whitespace-nowrap text-lg leading-tight text-ink">
                {formatPrice(property.price, property.purpose)}
              </p>
            </div>
            {broker && (
              <button
                type="button"
                onClick={() => openMessage(broker, property)}
                aria-label="Falar com o corretor"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
              >
                <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </button>
            )}
            <Button variant="solid" size="sm" className="h-11 px-5" onClick={() => openVisit(property)}>
              Agendar visita
            </Button>
          </div>
        </aside>,
        document.body,
      )}
    </>
  )
}
