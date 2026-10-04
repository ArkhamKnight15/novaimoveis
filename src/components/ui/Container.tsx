import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ContainerProps = HTMLAttributes<HTMLDivElement> & { size?: 'default' | 'narrow' }

export function Container({ className, size = 'default', ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12 2xl:px-16',
        size === 'default' ? 'max-w-[92rem]' : 'max-w-5xl',
        className,
      )}
      {...props}
    />
  )
}
