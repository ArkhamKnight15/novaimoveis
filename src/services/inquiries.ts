import type { InquiryResponse, LeadRequest, MessageRequest, VisitRequest } from '../types/inquiry'
import { API_URL, request, simulateLatency } from './http'

/**
 * Envio de leads. Com `VITE_API_URL`, faz POST para:
 *   /leads     (briefing "Encontrar meu imóvel")
 *   /visits    (agendamento de visita)
 *   /messages  (mensagem para o corretor)
 * Todos respondem { protocol, createdAt }.
 */

function createProtocol(prefix: string): InquiryResponse {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return { protocol: `${prefix}-${random}`, createdAt: new Date().toISOString() }
}

function post<T>(path: string, body: T, prefix: string): Promise<InquiryResponse> {
  if (API_URL) return request<InquiryResponse>(path, { method: 'POST', body: JSON.stringify(body) })
  return simulateLatency(() => createProtocol(prefix), undefined, 1100)
}

export const submitLead = (lead: LeadRequest) => post('/leads', lead, 'NV')
export const scheduleVisit = (visit: VisitRequest) => post('/visits', visit, 'VS')
export const sendMessage = (message: MessageRequest) => post('/messages', message, 'MS')
