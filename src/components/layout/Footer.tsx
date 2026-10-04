import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { company } from '../../data/company'
import { footerNavigation } from '../../data/navigation'
import { Logo } from '../brand/Logo'
import { SocialIcon } from '../brand/SocialIcon'
import { Container } from '../ui/Container'
import { SmartLink } from '../ui/SmartLink'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <Container className="pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo withTagline className="text-[1.6rem] text-white" />
            <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed">{company.description}</p>
            <ul className="mt-8 flex gap-2" aria-label="Redes sociais">
              {company.social.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} (abre em nova aba)`}
                    className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-gold-400 hover:text-gold-300"
                  >
                    <SocialIcon id={social.id} className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 sm:gap-12 lg:col-span-4 lg:col-start-6">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow text-[0.625rem] text-gold-300">{group.title}</h2>
                <ul className="mt-6 space-y-3.5 text-[0.9375rem]">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <SmartLink to={item.to} className="link-underline transition-colors hover:text-white">
                        {item.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <h2 className="eyebrow text-[0.625rem] text-gold-300">Contato</h2>
            <ul className="mt-6 space-y-4 text-[0.9375rem]">
              <li>
                <a
                  href={company.phone.href}
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="size-4 text-white/40" strokeWidth={1.5} />
                  {company.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Mail aria-hidden="true" className="size-4 text-white/40" strokeWidth={1.5} />
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-white/40" strokeWidth={1.5} />
                <address className="not-italic leading-relaxed">
                  {company.address.street}
                  <br />
                  {company.address.district}, {company.address.city} – {company.address.state}
                  <br />
                  CEP {company.address.zip}
                </address>
              </li>
            </ul>
            <ul className="mt-6 space-y-1 text-[0.8125rem] text-white/50">
              {company.hours.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
            <a
              href={company.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-white transition-colors hover:text-gold-300"
            >
              Conversar no WhatsApp <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Assinatura tipográfica */}
        <Logo decorative className="mt-20 flex justify-center text-[clamp(4rem,18vw,16rem)] text-white/[0.05]" />

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {company.name}. {company.creci}.
          </p>
          <p className="max-w-md sm:text-right">
            Projeto demonstrativo: imóveis, valores, pessoas e imagens são fictícios.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 self-start text-white/70 transition-colors hover:text-white sm:self-auto"
          >
            Voltar ao topo
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </Container>
    </footer>
  )
}
