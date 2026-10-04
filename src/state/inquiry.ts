import { createContext, useContext } from 'react'
import type { Broker } from '../types/content'
import type { Property } from '../types/property'

export type InquiryRequest =
  | { kind: 'lead' }
  | { kind: 'visit'; property: Property }
  | { kind: 'message'; property?: Property; broker: Broker }

export interface InquiryContextValue {
  /** Abre o briefing "Encontrar meu imóvel". */
  openLead: () => void
  openVisit: (property: Property) => void
  openMessage: (broker: Broker, property?: Property) => void
}

export const InquiryContext = createContext<InquiryContextValue | null>(null)

export function useInquiry(): InquiryContextValue {
  const context = useContext(InquiryContext)
  if (!context) throw new Error('useInquiry precisa estar dentro de <InquiryProvider>.')
  return context
}
