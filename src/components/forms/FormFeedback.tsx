import { CircleAlert, Check } from 'lucide-react'
import type { ReactNode } from 'react'

export function FormError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[2px] border border-danger-600/30 bg-danger-600/5 px-4 py-3"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger-600" strokeWidth={1.75} />
      <div className="text-[0.8125rem] leading-relaxed text-graphite-700">
        <p>{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-1 font-medium text-ink underline underline-offset-4">
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}

interface FormSuccessProps {
  title: string
  protocol: string
  children: ReactNode
  actions: ReactNode
}

/** Confirmação após o envio: o que aconteceu, o protocolo e os próximos passos. */
export function FormSuccess({ title, protocol, children, actions }: FormSuccessProps) {
  return (
    <div role="status" className="animate-page-in py-4 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold-400/60 text-gold-600">
        <Check aria-hidden="true" className="size-7" strokeWidth={1.25} />
      </span>
      <h3 className="font-editorial mt-6 text-3xl">{title}</h3>
      <div className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-graphite-500">{children}</div>
      <p className="eyebrow mt-6 text-[0.625rem] text-graphite-500">
        Protocolo <span className="ml-1 font-mono tabular-nums text-graphite-700">{protocol}</span>
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>
    </div>
  )
}

export const CONSENT_LABEL = 'Autorizo a NOVA a usar estes dados para responder ao meu contato, conforme a LGPD.'
