import { Heart } from 'lucide-react'
import { PropertyCard, PropertyCardSkeleton } from '../components/property/PropertyCard'
import { Button, ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { pluralize } from '../lib/format'
import { getPropertiesByIds } from '../services/properties'
import { useFavorites } from '../state/favorites'
import { useInquiry } from '../state/inquiry'

export function FavoritesPage() {
  const { ids, clear } = useFavorites()
  const { openLead } = useInquiry()
  const { data } = useAsync((signal) => getPropertiesByIds(ids, signal), [ids.join(',')])
  // Remove da lista imediatamente ao desfavoritar, sem esperar nova consulta.
  const items = (data ?? []).filter((property) => ids.includes(property.id))

  usePageMeta({
    title: 'Favoritos',
    description: 'Os imóveis que você salvou na NOVA Imóveis.',
    path: '/favoritos',
  })

  return (
    <Container className="min-h-[70svh] pb-28 pt-32 lg:pt-40">
      <header className="flex flex-col gap-8 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Sua seleção</Eyebrow>
          <h1 className="font-display mt-5 text-display-xl">Favoritos</h1>
          <p className="mt-4 text-graphite-500" aria-live="polite">
            {ids.length
              ? `${pluralize(ids.length, 'imóvel salvo', 'imóveis salvos')} neste navegador.`
              : 'Você ainda não salvou nenhum imóvel.'}
          </p>
        </div>
        {ids.length > 0 && (
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={clear}>
              Limpar lista
            </Button>
            <Button variant="solid" size="sm" onClick={openLead} arrow>
              Falar com um especialista
            </Button>
          </div>
        )}
      </header>

      {ids.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-gold-400/60 text-gold-600">
            <Heart aria-hidden="true" className="size-6" strokeWidth={1.25} />
          </span>
          <h2 className="font-editorial mt-6 text-3xl">Comece sua seleção</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite-500">
            Toque no coração dos imóveis que chamarem sua atenção. Eles ficam guardados aqui para você comparar com
            calma.
          </p>
          <ButtonLink to="/imoveis" variant="solid" arrow className="mt-8">
            Explorar imóveis
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {!data
            ? ids.map((id) => (
                <li key={id}>
                  <PropertyCardSkeleton />
                </li>
              ))
            : items.map((property) => (
                <li key={property.id} className="flex animate-page-in">
                  <PropertyCard property={property} className="w-full" />
                </li>
              ))}
        </ul>
      )}
    </Container>
  )
}
