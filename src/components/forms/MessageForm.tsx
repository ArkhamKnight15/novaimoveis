import { useMemo, useState, type FormEvent } from 'react'
import { useForm, type SubmitState } from '../../hooks/useForm'
import { validators } from '../../lib/validation'
import { sendMessage } from '../../services/inquiries'
import type { Broker } from '../../types/content'
import type { InquiryResponse } from '../../types/inquiry'
import type { Property } from '../../types/property'
import { Button } from '../ui/Button'
import { Checkbox, TextArea } from '../ui/Field'
import { ContactFields } from './ContactFields'
import { CONSENT_LABEL, FormError, FormSuccess } from './FormFeedback'
import { contactRules } from './rules'

interface MessageFormProps {
  broker: Broker
  property?: Property
  onDone: () => void
}

export function MessageForm({ broker, property, onDone }: MessageFormProps) {
  const firstName = broker.name.split(' ')[0]
  const [state, setState] = useState<SubmitState<InquiryResponse>>({ status: 'idle' })
  const rules = useMemo(
    () => ({
      ...contactRules,
      message: (value: string) =>
        validators.required('Escreva sua mensagem.')(value) ?? validators.maxLength(800)(value),
    }),
    [],
  )
  const form = useForm(
    {
      name: '',
      email: '',
      phone: '',
      message: property
        ? `Olá, ${firstName}! Tenho interesse no imóvel ${property.title} (${property.id}). Podemos conversar?`
        : `Olá, ${firstName}! Gostaria de conversar sobre imóveis em ${broker.region.split(',')[0]}.`,
      consent: false,
    },
    rules,
  )
  const { values, errors, setValue, blur } = form

  async function submit() {
    if (!form.validateFields(['name', 'email', 'phone', 'message', 'consent'])) return
    setState({ status: 'submitting' })
    try {
      const result = await sendMessage({
        brokerId: broker.id,
        propertyId: property?.id,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        message: values.message.trim(),
      })
      setState({ status: 'success', result })
    } catch {
      setState({ status: 'error', message: 'Não conseguimos enviar sua mensagem. Tente novamente em instantes.' })
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void submit()
  }

  if (state.status === 'success') {
    return (
      <FormSuccess
        title="Mensagem enviada"
        protocol={state.result.protocol}
        actions={
          <Button variant="solid" onClick={onDone}>
            Fechar
          </Button>
        }
      >
        {firstName} recebeu sua mensagem e responde em até duas horas úteis, pelo telefone ou e-mail informado.
      </FormSuccess>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <ContactFields values={values} errors={errors} onChange={setValue} onBlur={blur} />
      <TextArea
        label="Mensagem"
        name="message"
        data-field="message"
        rows={4}
        value={values.message}
        error={errors.message}
        onChange={(event) => setValue('message', event.target.value)}
        onBlur={() => blur('message')}
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
        {state.status === 'submitting' ? 'Enviando…' : `Enviar para ${firstName}`}
      </Button>
    </form>
  )
}
