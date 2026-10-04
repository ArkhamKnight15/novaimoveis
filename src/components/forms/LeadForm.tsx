import { ArrowLeft } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { priceRanges, propertyTypeOptions } from '../../data/catalog'
import { useForm, type SubmitState } from '../../hooks/useForm'
import { cn } from '../../lib/cn'
import { buildSearchUrl } from '../../lib/filters'
import { submitLead } from '../../services/inquiries'
import type { ContactPreference, InquiryResponse } from '../../types/inquiry'
import type { PropertyType, Purpose } from '../../types/property'
import { Button } from '../ui/Button'
import { ChipGroup } from '../ui/ChipGroup'
import { Checkbox, TextArea } from '../ui/Field'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Select } from '../ui/Select'
import { ContactFields } from './ContactFields'
import { CONSENT_LABEL, FormError, FormSuccess } from './FormFeedback'
import { contactRules } from './rules'
import { useLocationOptions } from '../../hooks/useLocationOptions'

interface LeadValues {
  purpose: Purpose
  type: PropertyType | undefined
  location: string
  budget: string
  bedrooms: string
  name: string
  email: string
  phone: string
  contactPreference: ContactPreference
  notes: string
  consent: boolean
}

const initialValues: LeadValues = {
  purpose: 'venda',
  type: undefined,
  location: '',
  budget: '',
  bedrooms: '0',
  name: '',
  email: '',
  phone: '',
  contactPreference: 'whatsapp',
  notes: '',
  consent: false,
}

const rules = {
  ...contactRules,
  notes: (value: string) => (value.length > 600 ? 'Use no máximo 600 caracteres.' : undefined),
}

const preferenceLabels: Record<ContactPreference, string> = {
  whatsapp: 'WhatsApp',
  telefone: 'telefone',
  email: 'e-mail',
}

const steps = ['O que você procura', 'Como falamos com você'] as const

/** Briefing em duas etapas do CTA "Encontrar meu imóvel". */
export function LeadForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const locationOptions = useLocationOptions()
  const [step, setStep] = useState(0)
  const [state, setState] = useState<SubmitState<InquiryResponse>>({ status: 'idle' })
  const form = useForm(initialValues, rules)
  const { values, errors, setValue, blur } = form

  const locations = useMemo(
    () => [
      { value: '', label: 'Ainda não sei' },
      ...locationOptions.map((option) => ({
        value: option.value,
        label: option.city ? `${option.label}, ${option.city}` : `${option.label} · todos os bairros`,
        group: option.city ? 'Bairros' : 'Cidades',
      })),
    ],
    [locationOptions],
  )

  const budgets = [{ value: '', label: 'Prefiro conversar' }, ...priceRanges[values.purpose]]

  async function submit() {
    if (!form.validateFields(['name', 'email', 'phone', 'notes', 'consent'])) return
    setState({ status: 'submitting' })
    try {
      const result = await submitLead({
        purpose: values.purpose,
        type: values.type ?? 'indiferente',
        location: values.location,
        budget: values.budget,
        bedrooms: values.bedrooms,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        contactPreference: values.contactPreference,
        notes: values.notes.trim() || undefined,
      })
      setState({ status: 'success', result })
    } catch {
      setState({ status: 'error', message: 'Não conseguimos enviar agora. Verifique sua conexão e tente novamente.' })
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (step === 0) setStep(1)
    else void submit()
  }

  if (state.status === 'success') {
    const range = priceRanges[values.purpose].find((option) => option.value === values.budget)
    const matchesUrl = buildSearchUrl({
      purpose: values.purpose,
      location: values.location || undefined,
      type: values.type,
      bedrooms: Number(values.bedrooms) || undefined,
      priceMin: range?.min,
      priceMax: range?.max,
    })
    return (
      <FormSuccess
        title="Briefing recebido"
        protocol={state.result.protocol}
        actions={
          <>
            <Button
              variant="solid"
              arrow
              onClick={() => {
                onClose()
                navigate(matchesUrl)
              }}
            >
              Ver imóveis compatíveis
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </>
        }
      >
        Obrigado, {values.name.trim().split(' ')[0]}. Um especialista vai falar com você por{' '}
        {preferenceLabels[values.contactPreference]} em até duas horas úteis com uma primeira seleção de imóveis.
      </FormSuccess>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="lead-step">
      <div className="mb-8">
        <div className="flex items-center justify-between text-[0.8125rem]">
          <p id="lead-step" aria-live="polite" className="text-graphite-500">
            Etapa {step + 1} de 2 · <span className="text-ink">{steps[step]}</span>
          </p>
          {step === 1 && (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 text-graphite-500 transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              Voltar
            </button>
          )}
        </div>
        <div aria-hidden="true" className="mt-3 h-px bg-line">
          <div
            className="h-px bg-ink transition-[width] duration-700 ease-out-expo"
            style={{ width: step === 0 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {step === 0 ? (
        <div key="step-1" className="animate-page-in space-y-7">
          <SegmentedControl
            label="Finalidade"
            hideLabel={false}
            block
            value={values.purpose}
            options={[
              { value: 'venda', label: 'Comprar' },
              { value: 'aluguel', label: 'Alugar' },
            ]}
            onChange={(purpose) => {
              setValue('purpose', purpose)
              setValue('budget', '')
            }}
          />
          <ChipGroup
            label="Tipo de imóvel"
            options={propertyTypeOptions}
            value={values.type}
            onChange={(type) => setValue('type', type)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Região de interesse"
              value={values.location}
              options={locations}
              onChange={(location) => setValue('location', location)}
            />
            <Select
              label="Orçamento"
              value={values.budget}
              options={budgets}
              onChange={(budget) => setValue('budget', budget)}
            />
          </div>
          <SegmentedControl
            label="Quartos"
            hideLabel={false}
            block
            value={values.bedrooms}
            options={[
              { value: '0', label: 'Tanto faz' },
              { value: '1', label: '1+' },
              { value: '2', label: '2+' },
              { value: '3', label: '3+' },
              { value: '4', label: '4+' },
            ]}
            onChange={(bedrooms) => setValue('bedrooms', bedrooms)}
          />
          <Button type="submit" variant="solid" size="lg" block arrow>
            Continuar
          </Button>
        </div>
      ) : (
        <div key="step-2" className="animate-page-in space-y-6">
          <ContactFields values={values} errors={errors} onChange={setValue} onBlur={blur} />
          <SegmentedControl
            label="Prefiro ser contatado por"
            hideLabel={false}
            block
            value={values.contactPreference}
            options={[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'telefone', label: 'Ligação' },
              { value: 'email', label: 'E-mail' },
            ]}
            onChange={(preference) => setValue('contactPreference', preference)}
          />
          <TextArea
            label="Algo mais que devemos saber?"
            optional
            name="notes"
            data-field="notes"
            rows={3}
            placeholder="Ex.: preciso de escritório em casa, mudança prevista para março."
            value={values.notes}
            error={errors.notes}
            onChange={(event) => setValue('notes', event.target.value)}
            onBlur={() => blur('notes')}
          />
          <Checkbox
            name="consent"
            data-field="consent"
            label={CONSENT_LABEL}
            checked={values.consent}
            error={errors.consent}
            onChange={(event) => setValue('consent', event.target.checked)}
          />
          {state.status === 'error' && <FormError message={state.message} onRetry={() => void submit()} />}
          <Button
            type="submit"
            variant="solid"
            size="lg"
            block
            arrow={state.status !== 'submitting'}
            disabled={state.status === 'submitting'}
            aria-busy={state.status === 'submitting'}
            className={cn(state.status === 'submitting' && 'cursor-wait')}
          >
            {state.status === 'submitting' ? 'Enviando…' : 'Enviar briefing'}
          </Button>
        </div>
      )}
    </form>
  )
}
