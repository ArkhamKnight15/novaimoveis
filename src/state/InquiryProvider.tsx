import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react'
import { BrokerAvatar } from '../components/property/BrokerAvatar'
import { Dialog } from '../components/ui/Dialog'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { Spinner } from '../components/ui/Spinner'
import { formatPrice } from '../lib/format'
import type { Broker } from '../types/content'
import type { Property } from '../types/property'
import { InquiryContext, type InquiryRequest } from './inquiry'

// Os formulários só são baixados quando o usuário abre um diálogo.
const LeadForm = lazy(() => import('../components/forms/LeadForm').then((module) => ({ default: module.LeadForm })))
const VisitForm = lazy(() => import('../components/forms/VisitForm').then((module) => ({ default: module.VisitForm })))
const MessageForm = lazy(() =>
  import('../components/forms/MessageForm').then((module) => ({ default: module.MessageForm })),
)

function FormFallback() {
  return (
    <div role="status" className="flex items-center gap-3 py-16 text-sm text-graphite-500">
      <Spinner /> Carregando formulário…
    </div>
  )
}

function PropertySummary({ property }: { property: Property }) {
  const cover = property.images[0]
  return (
    <div className="mb-8 flex items-center gap-4 border-y border-line py-4">
      {cover && (
        <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden bg-bone">
          <ResponsiveImage image={cover} alt="" sizes="96px" className="size-full object-cover" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-editorial truncate text-lg text-ink">{property.title}</p>
        <p className="truncate text-[0.8125rem] text-graphite-500">
          {property.location.neighborhood}, {property.location.city}
        </p>
        <p className="mt-1 text-[0.8125rem] font-medium text-ink">{formatPrice(property.price, property.purpose)}</p>
      </div>
    </div>
  )
}

function BrokerSummary({ broker }: { broker: Broker }) {
  return (
    <div className="mb-8 flex items-center gap-4 border-y border-line py-4">
      <BrokerAvatar broker={broker} className="size-14" />
      <div>
        <p className="font-editorial text-lg text-ink">{broker.name}</p>
        <p className="text-[0.8125rem] text-graphite-500">{broker.specialty}</p>
      </div>
    </div>
  )
}

/** Centraliza os diálogos de contato: briefing, agendamento de visita e mensagem ao corretor. */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<InquiryRequest | null>(null)
  const [open, setOpen] = useState(false)
  // A chave remonta o formulário a cada abertura, descartando estados de envio anteriores.
  const [session, setSession] = useState(0)

  const show = useCallback((next: InquiryRequest) => {
    setRequest(next)
    setSession((value) => value + 1)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({
      openLead: () => show({ kind: 'lead' }),
      openVisit: (property: Property) => show({ kind: 'visit', property }),
      openMessage: (broker: Broker, property?: Property) => show({ kind: 'message', broker, property }),
    }),
    [show],
  )

  let title = ''
  let description: string | undefined
  let body: ReactNode = null
  if (request?.kind === 'lead') {
    title = 'Encontrar meu imóvel'
    description = 'Conte o que você procura. Um especialista prepara uma seleção sob medida, sem compromisso.'
    body = <LeadForm key={session} onClose={close} />
  } else if (request?.kind === 'visit') {
    title = 'Agendar visita'
    description = 'Escolha o melhor dia e horário. Um especialista acompanha você no imóvel.'
    body = (
      <div key={session}>
        <PropertySummary property={request.property} />
        <VisitForm property={request.property} onDone={close} />
      </div>
    )
  } else if (request?.kind === 'message') {
    title = 'Falar com o corretor'
    description = request.property ? `Sobre ${request.property.title}` : undefined
    body = (
      <div key={session}>
        <BrokerSummary broker={request.broker} />
        <MessageForm broker={request.broker} property={request.property} onDone={close} />
      </div>
    )
  }

  return (
    <InquiryContext.Provider value={value}>
      {children}
      <Dialog
        open={open}
        onClose={close}
        title={title}
        description={description}
        size={request?.kind === 'visit' ? 'lg' : 'md'}
      >
        <Suspense fallback={<FormFallback />}>{body}</Suspense>
      </Dialog>
    </InquiryContext.Provider>
  )
}
