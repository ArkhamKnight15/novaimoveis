import { useMemo, useState, type FormEvent } from 'react'
import { useForm, type SubmitState } from '../../hooks/useForm'
import { formatLongDate } from '../../lib/format'
import { scheduleVisit } from '../../services/inquiries'
import type { InquiryResponse } from '../../types/inquiry'
import type { Property } from '../../types/property'
import { Button } from '../ui/Button'
import { ChoiceGrid, type Choice } from '../ui/ChoiceGrid'
import { Checkbox, TextArea } from '../ui/Field'
import { ContactFields } from './ContactFields'
import { CONSENT_LABEL, FormError, FormSuccess } from './FormFeedback'
import { contactRules } from './rules'

const TIMES = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']

/** Próximos dias úteis e sábados (sem domingos), a partir de amanhã. */
function upcomingDates(count = 8): Choice[] {
  const result: Choice[] = []
  const date = new Date()
  while (result.length < count) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() === 0) continue
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    result.push({
      value: iso,
      sublabel: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').replace(' de ', ' '),
    })
  }
  return result
}

interface VisitFormProps {
  property: Property
  onDone?: () => void
  /** Texto do botão final na tela de sucesso. */
  doneLabel?: string
}

export function VisitForm({ property, onDone, doneLabel = 'Fechar' }: VisitFormProps) {
  const dates = useMemo(() => upcomingDates(), [])
  const [state, setState] = useState<SubmitState<InquiryResponse>>({ status: 'idle' })
  const rules = useMemo(
    () => ({
      ...contactRules,
      date: (value: string) => (value ? undefined : 'Escolha o dia da visita.'),
      time: (value: string) => (value ? undefined : 'Escolha um horário.'),
    }),
    [],
  )
  const form = useForm({ date: '', time: '', name: '', email: '', phone: '', message: '', consent: false }, rules)
  const { values, errors, setValue, blur } = form
  // Sábados só têm visitas pela manhã.
  const isSaturday = values.date ? new Date(`${values.date}T12:00:00`).getDay() === 6 : false
  const times: Choice[] = TIMES.map((time) => ({ value: time, label: time, disabled: isSaturday && time > '12:00' }))

  async function submit() {
    if (!form.validateFields(['date', 'time', 'name', 'email', 'phone', 'consent'])) return
    setState({ status: 'submitting' })
    try {
      const result = await scheduleVisit({
        propertyId: property.id,
        date: values.date,
        time: values.time,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        message: values.message.trim() || undefined,
      })
      setState({ status: 'success', result })
    } catch {
      setState({ status: 'error', message: 'Não conseguimos registrar a visita agora. Tente novamente em instantes.' })
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void submit()
  }

  if (state.status === 'success') {
    return (
      <FormSuccess
        title="Visita solicitada"
        protocol={state.result.protocol}
        actions={
          onDone && (
            <Button variant="solid" onClick={onDone}>
              {doneLabel}
            </Button>
          )
        }
      >
        {property.title}, {formatLongDate(values.date)}, às {values.time}. Você recebe a confirmação e o endereço
        completo por WhatsApp e e-mail em até duas horas úteis.
      </FormSuccess>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-7">
      <ChoiceGrid
        name="date"
        label="Dia"
        choices={dates}
        value={values.date}
        error={errors.date}
        columns="grid-cols-4"
        onChange={(date) => {
          setValue('date', date)
          if (new Date(`${date}T12:00:00`).getDay() === 6 && values.time > '12:00') setValue('time', '')
        }}
      />
      <ChoiceGrid
        name="time"
        label={isSaturday ? 'Horário (aos sábados, até 12h)' : 'Horário'}
        choices={times}
        value={values.time}
        error={errors.time}
        columns="grid-cols-4 sm:grid-cols-7"
        onChange={(time) => setValue('time', time)}
      />
      <ContactFields values={values} errors={errors} onChange={setValue} onBlur={blur} />
      <TextArea
        label="Mensagem"
        optional
        name="message"
        rows={3}
        placeholder="Ex.: gostaria de ver também a área de lazer do condomínio."
        value={values.message}
        onChange={(event) => setValue('message', event.target.value)}
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
      >
        {state.status === 'submitting' ? 'Agendando…' : 'Agendar visita'}
      </Button>
    </form>
  )
}
