import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2'
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = 'dark',
  align = 'left',
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <Reveal as="header" className={cn('max-w-2xl', centered && 'mx-auto text-center', className)}>
      <Eyebrow tone={tone} className={cn(centered && 'justify-center')}>
        {eyebrow}
      </Eyebrow>
      <Heading id={id} className={cn('font-display mt-6 text-display-lg', tone === 'light' && 'text-paper')}>
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            'mt-6 max-w-xl text-base leading-relaxed sm:text-lg',
            centered && 'mx-auto',
            tone === 'dark' ? 'text-graphite-500' : 'text-white/70',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
