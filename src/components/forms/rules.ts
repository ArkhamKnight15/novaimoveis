import { validators } from '../../lib/validation'

/** Regras compartilhadas pelos formulários de contato. */
export const contactRules = {
  name: (value: string) => validators.name(value),
  email: (value: string) => validators.email(value),
  phone: (value: string) => validators.phone(value),
  consent: (value: boolean) => (value ? undefined : 'É preciso autorizar o contato para continuar.'),
}
