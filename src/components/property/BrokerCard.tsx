import { MessageCircle, Phone } from 'lucide-react'
import type { Broker } from '../../types/content'
import { Button, ButtonAnchor } from '../ui/Button'
import { BrokerPortrait } from './BrokerPortrait'

interface BrokerCardProps {
  broker: Broker
  onMessage: () => void
}

/** Corretor responsável pelo imóvel, com contato direto. */
export function BrokerCard({ broker, onMessage }: BrokerCardProps) {
  const phoneHref = `tel:+55${broker.phone.replace(/\D/g, '')}`
  return (
    <div className="grid gap-6 border border-line bg-white p-5 sm:grid-cols-[8.5rem_1fr] sm:p-6">
      <div className="aspect-[4/5] w-28 overflow-hidden sm:w-full">
        <BrokerPortrait broker={broker} sizes="140px" />
      </div>
      <div className="flex flex-col">
        <p className="eyebrow text-[0.5625rem] text-gold-700">Corretor responsável</p>
        <p className="font-display mt-3 text-2xl text-ink">{broker.name}</p>
        <p className="mt-1 text-sm text-graphite-600">{broker.specialty}</p>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-graphite-500">
          {broker.experience} anos de mercado · {broker.creci} · {broker.languages.join(', ')}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:pt-6">
          <Button
            variant="solid"
            size="sm"
            onClick={onMessage}
            icon={<MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} />}
          >
            Falar com o corretor
          </Button>
          <ButtonAnchor
            href={phoneHref}
            variant="outline"
            size="sm"
            icon={<Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />}
          >
            {broker.phone}
          </ButtonAnchor>
        </div>
      </div>
    </div>
  )
}
