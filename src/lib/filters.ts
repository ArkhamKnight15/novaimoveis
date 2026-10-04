import { propertyTypeLabels } from '../data/catalog'
import type {
  LocationOption,
  Property,
  PropertyFilters,
  PropertyQuery,
  PropertyType,
  Purpose,
  SortOption,
} from '../types/property'
import { slugify } from './slug'

/** Nomes amigáveis dos parâmetros de URL (ex.: /comprar?local=leblon&quartos=3). */
const PARAMS = {
  location: 'local',
  type: 'tipo',
  priceMin: 'preco-min',
  priceMax: 'preco-max',
  bedrooms: 'quartos',
  bathrooms: 'banheiros',
  areaMin: 'area-min',
  areaMax: 'area-max',
  parking: 'vagas',
  query: 'q',
  sort: 'ordem',
} as const

const NUMERIC_KEYS = ['priceMin', 'priceMax', 'bedrooms', 'bathrooms', 'areaMin', 'areaMax', 'parking'] as const

const SORT_VALUES: SortOption[] = ['recentes', 'menor-preco', 'maior-preco', 'maior-area']

export const purposePaths: Record<Purpose | 'todos', string> = {
  venda: '/comprar',
  aluguel: '/alugar',
  todos: '/imoveis',
}

function isPropertyType(value: string | null): value is PropertyType {
  return value !== null && value in propertyTypeLabels
}

function toPositiveNumber(value: string | null): number | undefined {
  if (!value) return undefined
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : undefined
}

/** Lê os filtros da URL. A finalidade vem do caminho (/comprar ou /alugar). */
export function parseQuery(params: URLSearchParams, purpose?: Purpose): PropertyQuery {
  const query: PropertyQuery = { purpose }
  const location = params.get(PARAMS.location)
  if (location) query.location = location
  const type = params.get(PARAMS.type)
  if (isPropertyType(type)) query.type = type
  for (const key of NUMERIC_KEYS) {
    const value = toPositiveNumber(params.get(PARAMS[key]))
    if (value !== undefined) query[key] = value
  }
  const text = params.get(PARAMS.query)?.trim()
  if (text) query.query = text
  const sort = params.get(PARAMS.sort) as SortOption | null
  if (sort && SORT_VALUES.includes(sort)) query.sort = sort
  return query
}

/** Gera a query string (sem a finalidade, que faz parte do caminho). */
export function toSearchParams(query: PropertyQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.location) params.set(PARAMS.location, query.location)
  if (query.type) params.set(PARAMS.type, query.type)
  for (const key of NUMERIC_KEYS) {
    const value = query[key]
    if (value !== undefined) params.set(PARAMS[key], String(value))
  }
  if (query.query) params.set(PARAMS.query, query.query)
  if (query.sort && query.sort !== 'recentes') params.set(PARAMS.sort, query.sort)
  return params
}

/** Monta a URL completa da busca: caminho da finalidade + parâmetros. */
export function buildSearchUrl(query: PropertyQuery): string {
  const path = purposePaths[query.purpose ?? 'todos']
  const params = toSearchParams(query).toString()
  return params ? `${path}?${params}` : path
}

export function countActiveFilters(filters: PropertyFilters): number {
  const keys: (keyof PropertyFilters)[] = ['location', 'type', 'query', ...NUMERIC_KEYS]
  return keys.filter((key) => filters[key] !== undefined && filters[key] !== '').length
}

function normalize(value: string): string {
  return slugify(value).replace(/-/g, ' ')
}

function matchesLocation(property: Property, location: string): boolean {
  const { neighborhood, city } = property.location
  return slugify(neighborhood) === location || slugify(city) === location
}

function matchesText(property: Property, text: string): boolean {
  const haystack = normalize(
    [
      property.title,
      property.headline,
      property.category,
      property.id,
      property.location.neighborhood,
      property.location.city,
      property.location.state,
    ].join(' '),
  )
  return normalize(text)
    .split(' ')
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

function inRange(value: number, min?: number, max?: number): boolean {
  return (min === undefined || value >= min) && (max === undefined || value <= max)
}

export function matchesFilters(property: Property, filters: PropertyFilters): boolean {
  if (filters.purpose && property.purpose !== filters.purpose) return false
  if (filters.location && !matchesLocation(property, filters.location)) return false
  if (filters.type && property.type !== filters.type) return false
  if (!inRange(property.price, filters.priceMin, filters.priceMax)) return false
  if (!inRange(property.area, filters.areaMin, filters.areaMax)) return false
  if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false
  if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false
  if (filters.parking && property.parking < filters.parking) return false
  if (filters.query && !matchesText(property, filters.query)) return false
  return true
}

const comparators: Record<SortOption, (a: Property, b: Property) => number> = {
  recentes: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  'menor-preco': (a, b) => a.price - b.price,
  'maior-preco': (a, b) => b.price - a.price,
  'maior-area': (a, b) => b.area - a.area,
}

export function applyQuery(list: Property[], query: PropertyQuery): Property[] {
  return list.filter((property) => matchesFilters(property, query)).sort(comparators[query.sort ?? 'recentes'])
}

/** Cidades e bairros disponíveis no catálogo, com a contagem de imóveis de cada um. */
export function buildLocationOptions(list: Property[]): LocationOption[] {
  const cities = new Map<string, LocationOption>()
  const neighborhoods = new Map<string, LocationOption>()
  for (const { location } of list) {
    const citySlug = slugify(location.city)
    const city = cities.get(citySlug) ?? { value: citySlug, label: location.city, count: 0 }
    city.count += 1
    cities.set(citySlug, city)
    const hoodSlug = slugify(location.neighborhood)
    const hood = neighborhoods.get(hoodSlug) ?? {
      value: hoodSlug,
      label: location.neighborhood,
      city: location.city,
      count: 0,
    }
    hood.count += 1
    neighborhoods.set(hoodSlug, hood)
  }
  const byLabel = (a: LocationOption, b: LocationOption) => a.label.localeCompare(b.label, 'pt-BR')
  return [...[...cities.values()].sort(byLabel), ...[...neighborhoods.values()].sort(byLabel)]
}
