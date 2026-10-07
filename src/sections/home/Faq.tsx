import { ArrowUpRight } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Reveal } from '../../components/ui/Reveal'
import { company } from '../../data/company'
import { faqItems } from '../../data/faq'
import { useInquiry } from '../../state/inquiry'

export function Faq() {
  const { openLead } = useInquiry()
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-28 lg:py-40">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 id="faq-title" className="font-display mt-6 text-display-lg">
            Tudo o que você precisa saber <span className="text-graphite-500">antes de começar</span>
          </h2>
          <div className="mt-10 border-t border-line pt-8">
            <p className="text-[0.9375rem] leading-relaxed text-graphite-500">
              Não encontrou sua resposta? Um especialista responde em até duas horas úteis.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button variant="solid" onClick={openLead} arrow>
                Falar com um especialista
              </Button>
              <a
                href={company.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 text-sm font-medium text-ink"
              >
                <span className="link-underline">WhatsApp</span>
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7 lg:col-start-6">
          <Accordion
            defaultOpen={faqItems[0]?.id}
            items={faqItems.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>),
            }))}
          />
        </Reveal>
      </Container>
    </section>
  )
}
