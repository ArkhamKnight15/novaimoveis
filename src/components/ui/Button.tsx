import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../../lib/cn'

type ButtonVariant = 'solid' | 'light' | 'outline' | 'outline-light' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Seta que desliza no hover. */
  arrow?: boolean
  icon?: ReactNode
  /** Ocupa toda a largura disponível. */
  block?: boolean
}

const base =
  'group/button relative inline-flex select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-[2px] text-[0.75rem] font-medium uppercase tracking-[0.16em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-quart active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  solid: 'bg-ink text-paper hover:bg-graphite-800',
  light: 'bg-paper text-ink hover:bg-white',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  'outline-light':
    'border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-ink',
  ghost: 'text-ink hover:bg-ink/5',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4',
  md: 'h-12 px-6',
  lg: 'h-14 px-8',
}

function buttonClasses({ variant = 'solid', size = 'md', block }: ButtonStyleProps, className?: string) {
  return cn(base, variants[variant], sizes[size], block && 'w-full', className)
}

function Content({ children, arrow, icon }: { children: ReactNode; arrow?: boolean; icon?: ReactNode }) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-4 transition-transform duration-500 ease-out-expo group-hover/button:translate-x-1"
        />
      )}
    </>
  )
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant,
  size,
  arrow,
  icon,
  block,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, block }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </button>
  )
}

type ButtonLinkProps = ButtonStyleProps & LinkProps

/** Botão que navega dentro do site (React Router). */
export function ButtonLink({ variant, size, arrow, icon, block, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, block }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </Link>
  )
}

type ButtonAnchorProps = ButtonStyleProps & AnchorHTMLAttributes<HTMLAnchorElement>

/** Botão para links externos (telefone, WhatsApp, e-mail). */
export function ButtonAnchor({ variant, size, arrow, icon, block, className, children, ...props }: ButtonAnchorProps) {
  return (
    <a className={buttonClasses({ variant, size, block }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </a>
  )
}
