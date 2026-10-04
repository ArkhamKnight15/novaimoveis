import { CircleCheck, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../lib/cn'
import { ToastContext, type ToastOptions } from './toast'

interface ToastItem extends ToastOptions {
  id: number
}

const DURATION = 4500

/** Notificações discretas no rodapé da tela, anunciadas por leitores de tela (aria-live). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])

  const show = useCallback((toast: ToastOptions) => {
    counter.current += 1
    const id = counter.current
    // Mantém no máximo duas notificações visíveis.
    setToasts((current) => [...current.slice(-1), { ...toast, id }])
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        data-toast-region
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:items-end sm:px-8 sm:pb-8"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(onDismiss, DURATION)
    return () => window.clearTimeout(timer)
  }, [paused, onDismiss])

  return (
    // Pausa o fechamento automático enquanto o usuário interage com a notificação.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="status"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm animate-page-in items-start gap-3 rounded-[3px] bg-ink px-4 py-3.5 text-paper shadow-float"
    >
      <CircleCheck
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn('mt-0.5 size-5 shrink-0', toast.tone === 'success' ? 'text-gold-300' : 'text-white/60')}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-[0.8125rem] text-white/65">{toast.description}</p>}
      </div>
      {toast.action && (
        <Link
          to={toast.action.to}
          onClick={onDismiss}
          className="eyebrow mt-1 shrink-0 text-[0.625rem] text-gold-300 transition-colors hover:text-gold-200"
        >
          {toast.action.label}
        </Link>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
