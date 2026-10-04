import type { AmenityId, PropertyBadge, PropertyType, Purpose, SortOption } from '../types/property'

export const purposeLabels: Record<Purpose, { action: string; noun: string }> = {
  venda: { action: 'Comprar', noun: 'Venda' },
  aluguel: { action: 'Alugar', noun: 'Locação' },
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  casa: 'Casa',
  'casa-condominio': 'Casa em condomínio',
  apartamento: 'Apartamento',
  cobertura: 'Cobertura',
  loft: 'Loft',
  studio: 'Studio',
}

export const propertyTypeOptions = (Object.keys(propertyTypeLabels) as PropertyType[]).map((value) => ({
  value,
  label: propertyTypeLabels[value],
}))

export const badgeLabels: Record<PropertyBadge, string> = {
  exclusivo: 'Exclusividade NOVA',
  lancamento: 'Lançamento',
  novo: 'Novo na NOVA',
  reduzido: 'Valor revisado',
}

export const amenityLabels: Record<AmenityId, string> = {
  piscina: 'Piscina',
  'piscina-aquecida': 'Piscina aquecida',
  academia: 'Academia',
  spa: 'Spa e sauna',
  jardim: 'Jardim',
  churrasqueira: 'Espaço gourmet',
  adega: 'Adega climatizada',
  'home-office': 'Home office',
  cinema: 'Sala de cinema',
  brinquedoteca: 'Brinquedoteca',
  portaria: 'Portaria 24 h',
  pet: 'Aceita pets',
  bicicletario: 'Bicicletário',
  coworking: 'Coworking',
  rooftop: 'Rooftop',
  automacao: 'Automação residencial',
  'energia-solar': 'Energia solar',
  'vista-mar': 'Vista para o mar',
  lareira: 'Lareira',
  'elevador-privativo': 'Elevador privativo',
  quadra: 'Quadra de tênis',
  praia: 'Acesso à praia',
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'maior-area', label: 'Maior área' },
]

export interface PriceRange {
  value: string
  label: string
  min?: number
  max?: number
}

/** Faixas de preço usadas na busca rápida do hero. */
export const priceRanges: Record<Purpose, PriceRange[]> = {
  venda: [
    { value: 'ate-3mi', label: 'Até R$ 3 mi', max: 3_000_000 },
    { value: '3-6mi', label: 'R$ 3 mi a R$ 6 mi', min: 3_000_000, max: 6_000_000 },
    { value: '6-10mi', label: 'R$ 6 mi a R$ 10 mi', min: 6_000_000, max: 10_000_000 },
    { value: 'acima-10mi', label: 'Acima de R$ 10 mi', min: 10_000_000 },
  ],
  aluguel: [
    { value: 'ate-10mil', label: 'Até R$ 10 mil', max: 10_000 },
    { value: '10-20mil', label: 'R$ 10 mil a R$ 20 mil', min: 10_000, max: 20_000 },
    { value: 'acima-20mil', label: 'Acima de R$ 20 mil', min: 20_000 },
  ],
}
