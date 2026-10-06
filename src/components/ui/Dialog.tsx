import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useScrollLock } from '../../hooks/useScrollLock'
import { cn } from '../../lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  /** Título acessível (visível no cabeçalho, a menos que `hideTitle`). */
  title: string
  description?: string
  children: ReactNode
  /**
   * center: modal centralizado (vira bottom sheet no mobile).
   * fullscreen: ocupa a tela toda (galeria, menu).
   * drawer: painel lateral (filtros no mobile/tablet).
   */
  variant?: 'center' | 'fullscreen' | 'drawer'
  size?: 'md' | 'lg'
  hideTitle?: boolean
  className?: string
  /** Conteúdo fixo no rodapé (ex.: botão "Ver imóveis"). */
  footer?: ReactNode
}

/**
 * Modal sobre o <dialog> nativo: foco preso, Esc, inert no restante da página e retorno
 * do foco ficam a cargo do navegador. Fecha também com clique no fundo.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  variant = 'center',
  size = 'md',
  hideTitle,
  className,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  useScrollLock(open)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Foco inicial no botão de fechar: evita abrir o teclado do celular num campo de texto.
      closeRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    // Clique no fundo fecha o diálogo; pelo teclado, Esc faz o mesmo (evento cancel).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={cn(
        'dialog-base m-0 overflow-hidden bg-paper p-0 text-graphite-600 backdrop:bg-transparent',
        variant === 'center' &&
          'dialog-center inset-x-0 bottom-0 top-auto max-h-[92svh] w-full max-w-none rounded-t-[4px] sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[min(88svh,56rem)] sm:rounded-[4px]',
        variant === 'center' && (size === 'md' ? 'sm:max-w-xl' : 'sm:max-w-3xl'),
        variant === 'fullscreen' && 'dialog-fade inset-0 size-full max-h-none max-w-none bg-ink text-white',
        variant === 'drawer' && 'dialog-drawer inset-y-0 left-auto right-0 h-full max-h-none w-full max-w-md',
        className,
      )}
    >
      <div className={cn('flex max-h-[inherit] flex-col', variant !== 'center' && 'h-full')}>
        <header
          className={cn(
            'flex shrink-0 items-start justify-between gap-6 px-6 pb-4 pt-6 sm:px-8 sm:pt-8',
            hideTitle && 'absolute inset-x-0 top-0 z-10 pb-0',
          )}
        >
          <div className={cn(hideTitle && 'sr-only')}>
            <h2 id={titleId} className="font-editorial text-2xl text-ink sm:text-3xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-graphite-500">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={cn(
              'ml-auto flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
              variant === 'fullscreen' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-bone text-ink hover:bg-sand',
            )}
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </header>
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain',
            variant !== 'fullscreen' && 'px-6 pb-8 sm:px-8',
          )}
        >
          {children}
        </div>
        {footer && <div className="shrink-0 border-t border-line bg-paper px-6 py-4 sm:px-8">{footer}</div>}
      </div>
    </dialog>
  )
}
