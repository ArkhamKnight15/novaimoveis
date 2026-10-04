import { maskPhone } from '../../lib/phone'
import { TextField } from '../ui/Field'

type ContactKey = 'name' | 'email' | 'phone'

interface ContactFieldsProps {
  values: Record<ContactKey, string>
  errors: Partial<Record<ContactKey, string | undefined>>
  onChange: (key: ContactKey, value: string) => void
  onBlur: (key: ContactKey) => void
}

/** Nome, e-mail e telefone (com máscara) — bloco comum aos formulários. */
export function ContactFields({ values, errors, onChange, onBlur }: ContactFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Nome completo"
        name="name"
        data-field="name"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={(event) => onChange('name', event.target.value)}
        onBlur={() => onBlur('name')}
        containerClassName="sm:col-span-2"
      />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        data-field="email"
        autoComplete="email"
        inputMode="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => onChange('email', event.target.value)}
        onBlur={() => onBlur('email')}
      />
      <TextField
        label="Telefone / WhatsApp"
        name="phone"
        type="tel"
        data-field="phone"
        autoComplete="tel-national"
        inputMode="tel"
        placeholder="(11) 98765-4321"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => onChange('phone', maskPhone(event.target.value))}
        onBlur={() => onBlur('phone')}
      />
    </div>
  )
}
