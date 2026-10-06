import { Plus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** Item aberto inicialmente. */
  defaultOpen?: string
  className?: string
}

/** Acordeão com um item aberto por vez e altura animada (grid-template-rows). */
export function Accordion({ items, defaultOpen, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | undefined>(defaultOpen)
  const baseId = useId()

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item) => {
        const open = openId === item.id
        const buttonId = `${baseId}-${item.id}-button`
        const panelId = `${baseId}-${item.id}-panel`
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? undefined : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span
                  className={cn(
                    'font-editorial text-xl leading-snug transition-colors duration-300 sm:text-2xl',
                    open ? 'text-ink' : 'text-graphite-700 group-hover:text-ink',
                  )}
                >
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-out-expo',
                    open ? 'rotate-45 border-ink bg-ink text-paper' : 'border-line text-ink group-hover:border-ink',
                  )}
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-2xl space-y-4 pb-8 pr-12 text-[0.9375rem] leading-relaxed text-graphite-500">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
