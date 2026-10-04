import { ArrowUpRight } from 'lucide-react'
import { company } from '../../data/company'
import { mainNavigation } from '../../data/navigation'
import { useInquiry } from '../../state/inquiry'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { SmartLink } from '../ui/SmartLink'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

/** Menu em tela cheia para celulares e tablets, com links em serifada e contatos diretos. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { openLead } = useInquiry()
  return (
    <Dialog open={open} onClose={onClose} title="Menu" hideTitle variant="fullscreen">
      <div className="flex min-h-full flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7 sm:px-10">
        <Logo withTagline className="text-[1.3rem] text-white" />
        <nav aria-label="Menu principal" className="mt-14 flex-1">
          <ul className="space-y-1">
            {mainNavigation.map((item, index) => (
              <li
                key={item.to}
                className="animate-page-in"
                style={{ animationDelay: open ? `${120 + index * 55}ms` : undefined }}
              >
                <SmartLink
                  to={item.to}
                  onClick={onClose}
                  className="group flex items-baseline gap-5 border-b border-white/10 py-4"
                >
                  <span className="eyebrow w-6 text-[0.625rem] text-gold-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-4xl text-white transition-transform duration-500 ease-out-expo group-hover:translate-x-1 sm:text-5xl">
                    {item.label}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 space-y-6">
          <Button
            variant="light"
            size="lg"
            block
            arrow
            onClick={() => {
              onClose()
              openLead()
            }}
          >
            Encontrar meu imóvel
          </Button>
          <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
            <a href={company.phone.href} className="flex items-center gap-1.5 hover:text-white">
              {company.phone.display}
            </a>
            <a
              href={company.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-end gap-1.5 hover:text-white"
            >
              WhatsApp <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
