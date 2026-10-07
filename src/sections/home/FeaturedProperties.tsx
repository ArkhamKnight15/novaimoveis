import { RotateCw } from 'lucide-react'
import { useState } from 'react'
import { PropertyCard, PropertyCardSkeleton } from '../../components/property/PropertyCard'
import { ButtonLink } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { useAsync } from '../../hooks/useAsync'
import { getFeaturedProperties } from '../../services/properties'
import type { Purpose } from '../../types/property'

type Filter = 'todos' | Purpose

export function FeaturedProperties() {
  const { status, data, retry } = useAsync((signal) => getFeaturedProperties(signal), [])
  const [filter, setFilter] = useState<Filter>('todos')
  const items = (data ?? []).filter((property) => filter === 'todos' || property.purpose === filter)

  return (
    <section aria-labelledby="featured-title" className="py-24 lg:py-36">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="featured-title"
            eyebrow="Seleção NOVA"
            title={
              <>
                Imóveis selecionados <span className="text-graphite-500">para você</span>
              </>
            }
            description="Uma seleção de propriedades que combinam localização, arquitetura e estilo de vida."
          />
          <Reveal className="flex flex-wrap items-center gap-6" delay={120}>
            <SegmentedControl
              label="Filtrar destaques"
              value={filter}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'venda', label: 'Comprar' },
                { value: 'aluguel', label: 'Alugar' },
              ]}
              onChange={setFilter}
              size="sm"
            />
            <ButtonLink
              to="/imoveis"
              variant="ghost"
              size="sm"
              arrow
              className="hidden px-0 hover:bg-transparent sm:inline-flex"
            >
              Ver todos
            </ButtonLink>
          </Reveal>
        </div>

        {status === 'error' && !data ? (
          <div role="alert" className="mt-16 flex flex-col items-start gap-4 border-y border-line py-12">
            <p className="text-graphite-600">Não foi possível carregar os destaques agora.</p>
            <button type="button" onClick={retry} className="flex items-center gap-2 text-sm font-medium text-ink">
              <RotateCw aria-hidden="true" className="size-4" strokeWidth={1.5} /> Tentar novamente
            </button>
          </div>
        ) : (
          <ul
            aria-busy={status === 'loading'}
            className="scrollbar-none -mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 lg:mt-20 xl:grid-cols-3"
          >
            {!data
              ? Array.from({ length: 6 }, (_, index) => (
                  <li key={index} className="w-[85%] shrink-0 snap-start md:w-auto">
                    <PropertyCardSkeleton />
                  </li>
                ))
              : items.map((property, index) => (
                  <Reveal
                    as="li"
                    key={property.id}
                    delay={(index % 3) * 90}
                    className="flex w-[85%] shrink-0 snap-start md:w-auto"
                  >
                    <PropertyCard property={property} className="w-full" />
                  </Reveal>
                ))}
          </ul>
        )}

        <div className="mt-14 flex justify-center sm:hidden">
          <ButtonLink to="/imoveis" variant="outline" arrow>
            Ver todos os imóveis
          </ButtonLink>
        </div>
        <p className="sr-only" aria-live="polite">
          {data ? `${items.length} imóveis em destaque` : ''}
        </p>
      </Container>
    </section>
  )
}
