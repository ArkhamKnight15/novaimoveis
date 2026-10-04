import type { Purpose, PropertyType } from './property'

export type ContactPreference = 'whatsapp' | 'telefone' | 'email'

/** Briefing do formulário "Encontrar meu imóvel". */
export interface LeadRequest {
  purpose: Purpose
  type: PropertyType | 'indiferente'
  location: string
  budget: string
  bedrooms: string
  name: string
  email: string
  phone: string
  contactPreference: ContactPreference
  notes?: string
}

export interface VisitRequest {
  propertyId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  message?: string
}

export interface MessageRequest {
  propertyId?: string
  brokerId?: string
  name: string
  email: string
  phone: string
  message: string
}

export interface InquiryResponse {
  protocol: string
  createdAt: string
}
