import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const controlBase =
  'w-full rounded-[2px] border bg-white text-[0.9375rem] text-ink placeholder:text-graphite-500 transition-[border-color,box-shadow] duration-300 outline-none focus:border-ink focus:ring-1 focus:ring-ink disabled:opacity-60'

interface FieldShellProps {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
  className?: string
}

function FieldShell({ id, label, error, hint, optional, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between text-[0.8125rem] font-medium text-graphite-700"
      >
        {label}
        {optional && <span className="text-xs font-normal text-graphite-500">Opcional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-danger-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-graphite-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  return hint ? `${id}-hint` : undefined
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  /** Texto fixo à direita do valor (ex.: "m²"). */
  suffix?: string
  /** Texto fixo à esquerda do valor (ex.: "R$"). */
  prefix?: string
  containerClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, optional, suffix, prefix, containerClassName, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint} optional={optional} className={containerClassName}>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-graphite-500">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(
            controlBase,
            'h-12 px-4',
            prefix && 'pl-11',
            suffix && 'pr-12',
            error ? 'border-danger-600' : 'border-line hover:border-graphite-300',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-graphite-500">
            {suffix}
          </span>
        )}
      </div>
    </FieldShell>
  )
})

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  containerClassName?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, optional, containerClassName, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint} optional={optional} className={containerClassName}>
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn(
          controlBase,
          'min-h-28 resize-y px-4 py-3 leading-relaxed',
          error ? 'border-danger-600' : 'border-line hover:border-graphite-300',
          className,
        )}
        {...props}
      />
    </FieldShell>
  )
})

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-graphite-500">
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[2px] accent-ink"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${fieldId}-error`} className="mt-2 pl-7 text-[0.8125rem] text-danger-600">
          {error}
        </p>
      )}
    </div>
  )
})
