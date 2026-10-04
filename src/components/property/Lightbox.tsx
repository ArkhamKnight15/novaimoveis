import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import type { ImageAsset } from '../../types/property'
import { Dialog } from '../ui/Dialog'
import { IconButton } from '../ui/IconButton'

interface LightboxProps {
  images: ImageAsset[]
  index: number
  open: boolean
  title: string
  onClose: () => void
  onIndexChange: (index: number) => void
}

/** Galeria em tela cheia: setas, teclado (← →, Esc), gesto de arrastar e miniaturas. */
export function Lightbox({ images, index, open, title, onClose, onIndexChange }: LightboxProps) {
  const pointerStart = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const image = images[index]
  const go = (delta: number) => onIndexChange((index + delta + images.length) % images.length)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  // Pré-carrega as vizinhas para a navegação ser instantânea.
  useEffect(() => {
    if (!open) return
    for (const delta of [-1, 1]) {
      const neighbor = images[(index + delta + images.length) % images.length]
      if (neighbor) {
        const preload = new Image()
        preload.sizes = '100vw'
        if (neighbor.srcSet) preload.srcset = neighbor.srcSet
        preload.src = neighbor.src
      }
    }
    thumbsRef.current?.children[index]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [open, index, images])

  return (
    <Dialog open={open} onClose={onClose} title={`Galeria: ${title}`} hideTitle variant="fullscreen">
      <div className="flex h-full flex-col">
        <div
          className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 pb-4 pt-20 sm:px-20"
          onPointerDown={(event) => {
            pointerStart.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return
            const delta = event.clientX - pointerStart.current
            pointerStart.current = null
            if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
          }}
        >
          {image && (
            <img
              key={image.src}
              src={image.src}
              srcSet={image.srcSet}
              sizes="100vw"
              width={image.width}
              height={image.height}
              alt={image.alt}
              draggable={false}
              className="max-h-full w-auto max-w-full animate-fade-in select-none object-contain"
            />
          )}
          <IconButton
            label="Foto anterior"
            tone="glass"
            size="lg"
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 sm:flex"
          >
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </IconButton>
          <IconButton
            label="Próxima foto"
            tone="glass"
            size="lg"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 sm:flex"
          >
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </IconButton>
        </div>

        <div className="shrink-0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="flex items-baseline justify-between gap-6 text-[0.8125rem] text-white/70">
            <p aria-live="polite" className="line-clamp-1">
              {image?.alt}
            </p>
            <p className="shrink-0 tabular-nums">
              {index + 1} / {images.length}
            </p>
          </div>
          <div ref={thumbsRef} className="scrollbar-none mt-4 flex gap-2 overflow-x-auto">
            {images.map((thumb, thumbIndex) => (
              <button
                key={thumb.src}
                type="button"
                onClick={() => onIndexChange(thumbIndex)}
                aria-label={`Ver foto ${thumbIndex + 1} de ${images.length}`}
                aria-current={thumbIndex === index}
                className={cn(
                  'relative aspect-[4/3] w-20 shrink-0 overflow-hidden transition-opacity duration-300 sm:w-24',
                  thumbIndex === index ? 'opacity-100 ring-1 ring-white' : 'opacity-45 hover:opacity-80',
                )}
              >
                <img
                  src={thumb.src.replace(/-\d+\.webp$/, '-800.webp')}
                  alt=""
                  loading="lazy"
                  width={thumb.width}
                  height={thumb.height}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
