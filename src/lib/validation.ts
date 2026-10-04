import { isValidPhone } from './phone'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const validators = {
  name: (value: string) => {
    const name = value.trim()
    if (!name) return 'Informe seu nome.'
    if (name.length < 3) return 'O nome precisa ter pelo menos 3 letras.'
    return undefined
  },
  email: (value: string) => {
    if (!value.trim()) return 'Informe seu e-mail.'
    return EMAIL_PATTERN.test(value.trim()) ? undefined : 'Informe um e-mail válido.'
  },
  phone: (value: string) => {
    if (!value.trim()) return 'Informe um telefone para contato.'
    return isValidPhone(value) ? undefined : 'Informe um telefone válido com DDD.'
  },
  required: (message: string) => (value: string) => (value.trim() ? undefined : message),
  maxLength: (max: number) => (value: string) => (value.length > max ? `Use no máximo ${max} caracteres.` : undefined),
} as const
