import { ArrowRight, Images, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { badgeLabels, purposeLabels } from '../../data/catalog'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import type { Property } from '../../types/property'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { Skeleton } from '../ui/Skeleton'
import { FavoriteButton } from './FavoriteButton'
import { PropertySpecs } from './PropertySpecs'

interface PropertyCardProps {
  property: Property
  sizes?: string
  priority?: boolean
  className?: string
}

/**
 * Card editorial: imagem grande sem moldura, informações em hierarquia tipográfica.
 * O card inteiro é clicável (link no título expandido), e o botão de favoritos fica acima dele.
 */
export function PropertyCard({
  property,
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 88vw',
  priority,
  className,
}: PropertyCardProps) {
  const cover = property.images[0]
  const href = `/imoveis/${property.slug}`
  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-bone">
        {cover && (
          <ResponsiveImage
            image={cover}
            sizes={sizes}
            priority={priority}
            className="size-full object-cover transition-[transform,opacity] duration-[1400ms] ease-out-expo group-hover:scale-[1.045]"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/10 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="eyebrow rounded-[2px] bg-paper/90 px-2.5 py-1.5 text-[0.5625rem] text-ink backdrop-blur">
            {purposeLabels[property.purpose].noun}
          </span>
          {property.badge && (
            <span className="eyebrow rounded-[2px] bg-ink/75 px-2.5 py-1.5 text-[0.5625rem] text-gold-200 backdrop-blur">
              {badgeLabels[property.badge]}
            </span>
          )}
        </div>
        <FavoriteButton property={property} className="absolute right-4 top-4 z-10" />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
          <span className="flex items-center gap-1.5 text-[0.75rem] text-white/85">
            <Images aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            {property.images.length} fotos
          </span>
          <span className="eyebrow flex translate-y-2 items-center gap-2 text-[0.5625rem] opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
            Ver detalhes <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        {/* Troca sutil de informação no hover: categoria → código do imóvel */}
        <div className="relative h-5 overflow-hidden">
          <p className="eyebrow text-[0.625rem] leading-5 text-gold-700 transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
            {property.category}
          </p>
          <p
            aria-hidden="true"
            className="eyebrow absolute inset-x-0 top-full text-[0.625rem] leading-5 text-graphite-500 transition-transform duration-500 ease-out-expo group-hover:-translate-y-full"
          >
            Cód. {property.id} · {property.location.neighborhood}
          </p>
        </div>
        <h3 className="font-display mt-2 text-[1.625rem] leading-tight">
          <Link
            to={href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
          >
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-graphite-500">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.5} />
          {property.location.neighborhood}, {property.location.city}
        </p>
        <PropertySpecs property={property} className="mt-4" />
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
            <p className="font-display text-xl text-ink">{formatPrice(property.price, property.purpose)}</p>
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
            >
              <ArrowRight
                className="size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-45"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/3]" />
      <Skeleton className="mt-6 h-3 w-1/3" />
      <Skeleton className="mt-4 h-7 w-2/3" />
      <Skeleton className="mt-3 h-3 w-1/2" />
      <Skeleton className="mt-6 h-px w-full" />
      <Skeleton className="mt-5 h-6 w-2/5" />
    </div>
  )
}
