/** Imagem com dimensões intrínsecas (evita layout shift) e variantes responsivas opcionais. */
export interface ImageAsset {
  src: string
  /** Ex.: "/images/a-800.webp 800w, /images/a-1600.webp 1600w" */
  srcSet?: string
  width: number
  height: number
  alt: string
}

/** Finalidade do anúncio: venda (Comprar) ou locação (Alugar). */
export type Purpose = 'venda' | 'aluguel'

export type PropertyType = 'casa' | 'casa-condominio' | 'apartamento' | 'cobertura' | 'loft' | 'studio'

export type PropertyBadge = 'exclusivo' | 'lancamento' | 'novo' | 'reduzido'

export type AmenityId =
  | 'piscina'
  | 'piscina-aquecida'
  | 'academia'
  | 'spa'
  | 'jardim'
  | 'churrasqueira'
  | 'adega'
  | 'home-office'
  | 'cinema'
  | 'brinquedoteca'
  | 'portaria'
  | 'pet'
  | 'bicicletario'
  | 'coworking'
  | 'rooftop'
  | 'automacao'
  | 'energia-solar'
  | 'vista-mar'
  | 'lareira'
  | 'elevador-privativo'
  | 'quadra'
  | 'praia'

export interface PropertyLocation {
  neighborhood: string
  city: string
  state: string
  /** Zona ou região, quando relevante (ex.: "Zona Sul"). */
  region?: string
  /** Coordenadas aproximadas (o endereço exato é informado após o agendamento). */
  coordinates: { lat: number; lng: number }
}

export interface NearbyPlace {
  label: string
  distance: string
}

export interface CondoInfo {
  name?: string
  yearBuilt: number
  floor?: number
  totalFloors?: number
  unitsPerFloor?: number
  furnished: boolean
  petFriendly: boolean
  /** Itens de infraestrutura do condomínio, em texto livre. */
  services: string[]
}

export interface Property {
  /** Código público do imóvel (ex.: "NV-1042"). */
  id: string
  slug: string
  title: string
  headline: string
  /** Rótulo editorial exibido nos cards (ex.: "Casa contemporânea"). */
  category: string
  type: PropertyType
  purpose: Purpose
  /** Venda: valor total. Aluguel: valor mensal. Em reais. */
  price: number
  /** Condomínio mensal, em reais. */
  condoFee?: number
  /** IPTU anual, em reais. */
  iptu?: number
  location: PropertyLocation
  bedrooms: number
  suites: number
  bathrooms: number
  /** Área privativa em m². */
  area: number
  /** Área do terreno em m² (casas). */
  lotArea?: number
  parking: number
  description: string[]
  features: string[]
  amenities: AmenityId[]
  condo: CondoInfo
  nearby: NearbyPlace[]
  images: ImageAsset[]
  brokerId: string
  /** Data de publicação (ISO 8601), usada na ordenação por mais recentes. */
  publishedAt: string
  badge?: PropertyBadge
  featured: boolean
  architect?: string
}

export type SortOption = 'recentes' | 'menor-preco' | 'maior-preco' | 'maior-area'

export interface PropertyFilters {
  purpose?: Purpose
  /** Slug de cidade ou bairro. */
  location?: string
  type?: PropertyType
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  areaMin?: number
  areaMax?: number
  parking?: number
  /** Busca livre por título, bairro, cidade ou código. */
  query?: string
}

export interface PropertyQuery extends PropertyFilters {
  sort?: SortOption
}

export interface PropertyListResult {
  items: Property[]
  total: number
}

export interface LocationOption {
  value: string
  label: string
  /** Cidade à qual o bairro pertence (ausente nas opções de cidade). */
  city?: string
  count: number
}
