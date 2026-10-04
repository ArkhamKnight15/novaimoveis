import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto acessível obrigatório: o botão não tem rótulo visível. */
  label: string
  tone?: 'light' | 'dark' | 'glass' | 'plain'
  size?: 'sm' | 'md' | 'lg'
}

const tones = {
  light: 'bg-paper text-ink ring-1 ring-ink/10 hover:ring-ink/30',
  dark: 'bg-ink text-paper hover:bg-graphite-800',
  glass: 'bg-white/80 text-ink backdrop-blur-md hover:bg-white',
  plain: 'text-current hover:bg-current/10',
}

const sizes = { sm: 'size-9', md: 'size-11', lg: 'size-12' }

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = 'light', size = 'md', className, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow,color,transform,opacity] duration-300 ease-out-quart active:scale-95 disabled:pointer-events-none disabled:opacity-40',
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
