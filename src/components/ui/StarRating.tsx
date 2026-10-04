import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <span role="img" aria-label={`Avaliação ${value} de 5`} className={cn('flex gap-1 text-gold-500', className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          strokeWidth={1.25}
          className={cn('size-3.5', index < value ? 'fill-current' : 'fill-transparent opacity-40')}
        />
      ))}
    </span>
  )
}
