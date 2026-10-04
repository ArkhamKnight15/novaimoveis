import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import type { ImageAsset } from '../../types/property'
import { IconButton } from '../ui/IconButton'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { Lightbox } from './Lightbox'

interface PropertyGalleryProps {
  images: ImageAsset[]
  title: string
}

/** Imagem principal grande com crossfade, setas, gesto de arrastar, miniaturas e lightbox. */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0)
  const [visited, setVisited] = useState(() => new Set([0, 1]))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const pointerStart = useRef<number | null>(null)
  // Evita que o "clique" no fim de um gesto de arrastar abra o lightbox.
  const swiped = useRef(false)

  function show(next: number) {
    const normalized = (next + images.length) % images.length
    setIndex(normalized)
    setVisited((current) => new Set([...current, normalized, (normalized + 1) % images.length]))
  }

  return (
    <div>
      <div
        className="group relative aspect-[4/3] touch-pan-y overflow-hidden bg-bone sm:aspect-[16/10]"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX
          swiped.current = false
        }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return
          const delta = event.clientX - pointerStart.current
          pointerStart.current = null
          if (Math.abs(delta) > 50) {
            swiped.current = true
            show(index + (delta < 0 ? 1 : -1))
          }
        }}
      >
        {images.map((image, imageIndex) =>
          visited.has(imageIndex) ? (
            <ResponsiveImage
              key={image.src}
              image={image}
              sizes="(min-width: 1024px) 64vw, 100vw"
              priority={imageIndex === 0}
              aria-hidden={imageIndex !== index}
              alt={imageIndex === index ? image.alt : ''}
              draggable={false}
              className={cn(
                'absolute inset-0 size-full select-none object-cover transition-[opacity,transform] duration-700 ease-out-quart',
                imageIndex === index ? '!opacity-100' : '!opacity-0',
              )}
            />
          ) : null,
        )}
        <button
          type="button"
          onClick={() => {
            if (swiped.current) swiped.current = false
            else setLightboxOpen(true)
          }}
          aria-label={`Ampliar foto ${index + 1} de ${images.length}`}
          className="absolute inset-0 cursor-zoom-in"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/50 to-transparent p-4 pt-16 sm:p-6">
          <p className="eyebrow text-[0.625rem] tabular-nums text-white">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </p>
          <span className="eyebrow flex items-center gap-2 text-[0.5625rem] text-white/85">
            <Expand aria-hidden="true" className="size-3.5" strokeWidth={1.5} /> Ampliar
          </span>
        </div>
        <IconButton
          label="Foto anterior"
          tone="glass"
          onClick={() => show(index - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        >
          <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </IconButton>
        <IconButton
          label="Próxima foto"
          tone="glass"
          onClick={() => show(index + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        >
          <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </IconButton>
      </div>

      <div className="scrollbar-none mt-3 flex gap-3 overflow-x-auto pb-1">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            onClick={() => show(imageIndex)}
            aria-label={`Mostrar foto ${imageIndex + 1}: ${image.alt}`}
            aria-current={imageIndex === index}
            className={cn(
              'relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-bone transition-opacity duration-300 sm:w-32',
              imageIndex === index ? 'opacity-100' : 'opacity-55 hover:opacity-100',
            )}
          >
            <ResponsiveImage image={image} alt="" sizes="128px" className="size-full object-cover" />
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink transition-transform duration-500 ease-out-expo',
                imageIndex === index ? 'scale-x-100' : 'scale-x-0',
              )}
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={index}
        open={lightboxOpen}
        title={title}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={show}
      />
    </div>
  )
}
