import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Reveal } from '../../components/ui/Reveal'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { company } from '../../data/company'
import { ctaImage } from '../../data/media'
import { useInquiry } from '../../state/inquiry'

const channels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: company.whatsapp.display,
    href: company.whatsapp.href,
    external: true,
  },
  { icon: Phone, label: 'Telefone', value: company.phone.display, href: company.phone.href },
  { icon: Mail, label: 'E-mail', value: company.email, href: `mailto:${company.email}` },
  {
    icon: MapPin,
    label: 'Escritório',
    value: `${company.address.street}, ${company.address.district}`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address.street}, ${company.address.city}`)}`,
    external: true,
  },
]

export function FinalCta() {
  const { openLead } = useInquiry()
  return (
    <section id="contato" aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <ResponsiveImage image={ctaImage} alt="" sizes="100vw" className="parallax-image size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(17_16_14/0.82)_0%,rgb(17_16_14/0.5)_55%,rgb(17_16_14/0.2)_100%),linear-gradient(0deg,rgb(17_16_14/0.85)_0%,rgb(17_16_14/0)_45%)]" />
      </div>
      <Container className="flex min-h-[44rem] flex-col justify-between gap-20 pb-10 pt-32 lg:min-h-[52rem] lg:pt-40">
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">Contato</Eyebrow>
          <h2 id="cta-title" className="font-display mt-6 text-display-xl text-white">
            Seu próximo endereço <em className="text-gold-200">começa aqui.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
            Conte o que você procura. Nós encontramos o imóvel certo para você.
          </p>
          <Button variant="light" size="lg" arrow onClick={openLead} className="mt-10">
            Encontrar meu imóvel
          </Button>
        </Reveal>

        <Reveal delay={120} as="div">
          <ul className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="border-b border-white/15 lg:border-b-0 lg:[&+li]:border-l lg:[&+li]:pl-8">
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noreferrer' })}
                  className="group flex items-start justify-between gap-4 py-6 lg:pr-6"
                >
                  <span>
                    <span className="eyebrow flex items-center gap-2 text-[0.5625rem] text-white/55">
                      <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                      {label}
                    </span>
                    <span className="mt-3 block text-[0.9375rem] text-white transition-colors group-hover:text-gold-200">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-white/40 transition-[transform,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    strokeWidth={1.5}
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
