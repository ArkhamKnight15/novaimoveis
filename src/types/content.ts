import type { ImageAsset } from './property'

export interface Broker {
  id: string
  name: string
  role: string
  specialty: string
  region: string
  /** Anos de mercado. */
  experience: number
  creci: string
  phone: string
  email: string
  bio: string
  languages: string[]
  /** Retrato 4:5. Sem foto, exibimos um monograma. */
  photo?: ImageAsset
}

export interface Testimonial {
  id: string
  name: string
  context: string
  rating: number
  quote: string
  /** Trecho em destaque, exibido em tamanho maior. */
  highlight: string
  photo?: ImageAsset
}

export interface FaqItem {
  id: string
  question: string
  answer: string[]
}

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export interface Differential {
  id: string
  title: string
  description: string
  detail: string
  image: ImageAsset
}

export interface ProcessStep {
  id: string
  title: string
  description: string
}

export interface CaseStudy {
  id: string
  category: string
  title: string
  location: string
  summary: string
  before: ImageAsset
  after: ImageAsset
  metrics: { label: string; before: string; after: string }[]
  result: string
  duration: string
}

export interface NavItem {
  label: string
  to: string
}
