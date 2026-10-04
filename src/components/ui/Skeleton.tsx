import { cn } from '../../lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative overflow-hidden bg-bone', className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  )
}
