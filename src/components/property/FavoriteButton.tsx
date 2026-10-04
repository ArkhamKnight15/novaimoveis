import { Heart } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { useFavorites } from '../../state/favorites'
import { useToast } from '../../state/toast'
import type { Property } from '../../types/property'

interface FavoriteButtonProps {
  property: Pick<Property, 'id' | 'title'>
  /** glass: sobre imagens; outline: na página do imóvel, com rótulo visível. */
  variant?: 'glass' | 'outline'
  className?: string
}

export function FavoriteButton({ property, variant = 'glass', className }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const toast = useToast()
  const [pop, setPop] = useState(0)
  const active = isFavorite(property.id)

  function onClick() {
    const added = toggle(property.id)
    setPop((value) => value + 1)
    toast(
      added
        ? {
            title: 'Salvo nos favoritos',
            description: property.title,
            action: { label: 'Ver favoritos', to: '/favoritos' },
            tone: 'success',
          }
        : { title: 'Removido dos favoritos', description: property.title },
    )
  }

  const icon = (
    <Heart
      key={pop}
      aria-hidden="true"
      strokeWidth={1.5}
      className={cn(
        'size-[1.05rem] transition-colors duration-300',
        pop > 0 && 'animate-heart-pop',
        active ? 'fill-gold-500 text-gold-500' : 'fill-transparent',
      )}
    />
  )

  if (variant === 'outline') {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          'inline-flex h-11 items-center gap-2.5 rounded-full border px-5 text-[0.8125rem] font-medium transition-[border-color,background-color] duration-300',
          active
            ? 'border-gold-400 bg-gold-200/30 text-ink'
            : 'border-line text-graphite-700 hover:border-ink hover:text-ink',
          className,
        )}
      >
        {icon}
        {active ? 'Salvo' : 'Salvar'}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remover ${property.title} dos favoritos` : `Salvar ${property.title} nos favoritos`}
      onClick={onClick}
      className={cn(
        'flex size-10 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur-md transition-[background-color,transform] duration-300 hover:bg-paper active:scale-90',
        className,
      )}
    >
      {icon}
    </button>
  )
}
