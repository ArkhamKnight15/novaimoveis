import { RotateCw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'
import { PropertyCard, PropertyCardSkeleton } from '../components/property/PropertyCard'
import { ActiveFilters } from '../components/search/ActiveFilters'
import { FiltersPanel } from '../components/search/FiltersPanel'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Dialog } from '../components/ui/Dialog'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import { sortOptions } from '../data/catalog'
import { useAsync } from '../hooks/useAsync'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePageMeta } from '../hooks/usePageMeta'
import { cn } from '../lib/cn'
import { buildSearchUrl, countActiveFilters, parseQuery, purposePaths, toSearchParams } from '../lib/filters'
import { pluralize } from '../lib/format'
import { searchProperties } from '../services/properties'
import { useInquiry } from '../state/inquiry'
import type { PropertyQuery, Purpose, SortOption } from '../types/property'

const copy: Record<Purpose | 'todos', { title: string; description: string }> = {
  venda: {
    title: 'Imóveis à venda',
    description: 'Casas, apartamentos e coberturas de alto padrão selecionados um a um pela NOVA.',
  },
  aluguel: {
    title: 'Imóveis para alugar',
    description: 'Locação de alto padrão com contrato digital, garantias flexíveis e imóveis vistoriados.',
  },
  todos: {
    title: 'Todos os imóveis',
    description: 'O portfólio completo da NOVA para compra e locação, em 15 cidades.',
  },
}

const purposeTabs = [
  { key: 'todos', label: 'Todos' },
  { key: 'venda', label: 'Comprar' },
  { key: 'aluguel', label: 'Alugar' },
] as const

export function SearchPage({ purpose }: { purpose?: Purpose }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { openLead } = useInquiry()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const query = useMemo(() => parseQuery(params, purpose), [params, purpose])
  const key = `${purpose ?? 'todos'}?${params.toString()}`
  const { status, data, retry } = useAsync((signal) => searchProperties(query, signal), [key])
  const pageCopy = copy[purpose ?? 'todos']
  const activeCount = countActiveFilters(query)
  const loading = status === 'loading'

  usePageMeta({ title: pageCopy.title, description: pageCopy.description, path: purposePaths[purpose ?? 'todos'] })

  function update(patch: Partial<PropertyQuery>) {
    setParams(toSearchParams({ ...query, ...patch }), { replace: true, preventScrollReset: true })
  }

  function changePurpose(next: Purpose | undefined) {
    navigate(buildSearchUrl({ ...query, purpose: next, priceMin: undefined, priceMax: undefined }), {
      preventScrollReset: true,
    })
  }

  function clearFilters() {
    setParams(toSearchParams({ sort: query.sort }), { replace: true, preventScrollReset: true })
  }

  // Busca livre com debounce
  const [text, setText] = useState(query.query ?? '')
  const debouncedText = useDebouncedValue(text, 400)
  useEffect(() => {
    setText((current) => (current.trim() === (query.query ?? '') ? current : (query.query ?? '')))
  }, [query.query])
  useEffect(() => {
    const value = debouncedText.trim() || undefined
    if (value !== query.query) update({ query: value })
    // Só a digitação confirmada deve atualizar a URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText])

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <>
      <header className="bg-bone pb-12 pt-32 lg:pb-16 lg:pt-40">
        <Container>
          <nav aria-label="Trilha de navegação" className="text-[0.8125rem] text-graphite-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {pageCopy.title}
              </li>
            </ol>
          </nav>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-display-xl">{pageCopy.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg">
                {pageCopy.description}
              </p>
            </div>
            <nav aria-label="Finalidade" className="flex gap-1 rounded-[2px] bg-paper p-1 shadow-panel">
              {purposeTabs.map((tab) => (
                <NavLink
                  key={tab.key}
                  to={{
                    pathname: purposePaths[tab.key],
                    search: toSearchParams({ ...query, priceMin: undefined, priceMax: undefined }).toString(),
                  }}
                  end
                  preventScrollReset
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 items-center rounded-[2px] px-5 text-sm font-medium transition-colors duration-300',
                      isActive ? 'bg-ink text-paper' : 'text-graphite-500 hover:text-ink',
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div role="search" className="relative mt-10">
            <label htmlFor="search-text" className="sr-only">
              Buscar por bairro, cidade, nome ou código
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-graphite-400"
              strokeWidth={1.5}
            />
            <input
              id="search-text"
              type="search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Busque por bairro, cidade, nome ou código (ex.: NV-1042)"
              autoComplete="off"
              className="h-16 w-full rounded-[2px] border border-line bg-paper pl-14 pr-14 text-base text-ink shadow-panel outline-none transition-[border-color,box-shadow] placeholder:text-graphite-500 focus:border-ink focus:ring-1 focus:ring-ink [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                aria-label="Limpar busca"
                className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-graphite-500 transition-colors hover:bg-bone hover:text-ink"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 pb-28 pt-10 lg:grid-cols-[17.5rem_1fr] lg:gap-14 lg:pt-14 xl:grid-cols-[19rem_1fr]">
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-editorial text-2xl">Filtros</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[0.8125rem] font-medium text-ink underline-offset-4 hover:underline"
                >
                  Limpar ({activeCount})
                </button>
              )}
            </div>
            <FiltersPanel query={query} onChange={update} onPurposeChange={changePurpose} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-[var(--nav-offset,4.25rem)] z-20 -mx-5 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-lg transition-[top] duration-500 ease-out-expo sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
              icon={<SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={1.5} />}
              className="lg:hidden"
            >
              Filtros{activeCount > 0 && ` (${activeCount})`}
            </Button>
            <p aria-live="polite" className="hidden items-center gap-2 text-sm text-graphite-500 lg:flex">
              {loading ? (
                <>
                  <Spinner className="size-3.5" /> Buscando imóveis…
                </>
              ) : (
                <>
                  <span className="font-medium text-ink">{pluralize(total, 'imóvel', 'imóveis')}</span>
                  {total === 1 ? 'encontrado' : 'encontrados'}
                </>
              )}
            </p>
            <Select
              variant="inline"
              label="Ordenar por"
              value={query.sort ?? 'recentes'}
              options={sortOptions}
              onChange={(sort) => update({ sort: sort as SortOption })}
              className="min-w-40 sm:min-w-44"
            />
          </div>

          <p aria-hidden="true" className="mt-6 text-sm text-graphite-500 lg:hidden">
            {loading
              ? 'Buscando imóveis…'
              : `${pluralize(total, 'imóvel', 'imóveis')} ${total === 1 ? 'encontrado' : 'encontrados'}`}
          </p>

          <h2 className="sr-only">Resultados</h2>
          <div className="mt-6">
            <ActiveFilters query={query} onRemove={update} onClear={clearFilters} />
          </div>

          {status === 'error' ? (
            <div role="alert" className="mt-10 flex flex-col items-start gap-4 border-y border-line py-14">
              <h2 className="font-editorial text-2xl">Não foi possível carregar os imóveis</h2>
              <p className="text-graphite-500">Verifique sua conexão e tente novamente.</p>
              <Button
                variant="outline"
                onClick={retry}
                icon={<RotateCw aria-hidden="true" className="size-4" strokeWidth={1.5} />}
              >
                Tentar novamente
              </Button>
            </div>
          ) : !data ? (
            <ul aria-hidden="true" className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index}>
                  <PropertyCardSkeleton />
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <div className="mt-10 flex flex-col items-center border border-dashed border-graphite-200 px-6 py-20 text-center">
              <SearchX aria-hidden="true" className="size-10 text-gold-500" strokeWidth={1} />
              <h2 className="font-editorial mt-6 text-3xl">Nenhum imóvel com esses filtros</h2>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-graphite-500">
                Tente ampliar a faixa de preço ou remover algum filtro. Ou conte o que você procura: muitos imóveis da
                NOVA são negociados antes mesmo de serem anunciados.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
                <Button variant="solid" onClick={openLead} arrow>
                  Falar com um especialista
                </Button>
              </div>
            </div>
          ) : (
            <ul
              aria-busy={loading}
              className={cn(
                'mt-10 grid gap-x-8 gap-y-14 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3',
                loading && 'opacity-50',
              )}
            >
              {items.map((property, index) => (
                <li
                  key={property.id}
                  className="flex animate-page-in"
                  style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                >
                  <PropertyCard
                    property={property}
                    priority={index < 2}
                    sizes="(min-width: 1280px) 24vw, (min-width: 640px) 45vw, 92vw"
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        variant="drawer"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={clearFilters} disabled={activeCount === 0}>
              Limpar
            </Button>
            <Button variant="solid" block onClick={() => setFiltersOpen(false)}>
              {loading ? 'Buscando…' : `Ver ${pluralize(total, 'imóvel', 'imóveis')}`}
            </Button>
          </div>
        }
      >
        <FiltersPanel query={query} onChange={update} onPurposeChange={changePurpose} />
      </Dialog>
    </>
  )
}
