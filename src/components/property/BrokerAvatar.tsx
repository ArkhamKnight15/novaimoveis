import { cn } from '../../lib/cn'
import { getInitials } from '../../lib/initials'
import type { Broker } from '../../types/content'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Avatar circular do corretor: foto quando houver, monograma caso contrário. */
export function BrokerAvatar({ broker, className }: { broker: Broker; className?: string }) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sand to-bone ring-1 ring-ink/5',
        className,
      )}
    >
      {broker.photo ? (
        <ResponsiveImage image={broker.photo} alt="" sizes="96px" className="size-full object-cover" />
      ) : (
        <span aria-hidden="true" className="font-editorial text-[1.15em] text-graphite-600">
          {getInitials(broker.name)}
        </span>
      )}
    </span>
  )
}
