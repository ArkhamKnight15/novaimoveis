import { MoveHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import type { ImageAsset } from '../../types/property'
import { ResponsiveImage } from './ResponsiveImage'

interface BeforeAfterProps {
  before: ImageAsset
  after: ImageAsset
  sizes: string
}

/**
 * Comparador antes/depois. O controle é um <input type="range"> transparente sobre as imagens,
 * então funciona com mouse, toque e teclado (setas, Home/End) sem código extra.
 */
export function BeforeAfter({ before, after, sizes }: BeforeAfterProps) {
  const [position, setPosition] = useState(50)
  const id = useId()
  return (
    <div className="group relative aspect-[3/2] select-none overflow-hidden bg-graphite-900">
      <ResponsiveImage image={after} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <ResponsiveImage image={before} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      </div>

      <span className="eyebrow absolute left-4 top-4 rounded-[2px] bg-ink/70 px-2.5 py-1.5 text-[0.5625rem] text-white backdrop-blur">
        Antes
      </span>
      <span className="eyebrow absolute right-4 top-4 rounded-[2px] bg-paper/90 px-2.5 py-1.5 text-[0.5625rem] text-ink backdrop-blur">
        Depois
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -ml-px w-0.5 bg-white/90"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-float transition-transform duration-300 group-active:scale-90">
          <MoveHorizontal className="size-5" strokeWidth={1.5} />
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Comparar antes e depois
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        aria-valuetext={`${position}% da imagem de antes visível`}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="peer absolute inset-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-gold-400 opacity-0 transition-opacity peer-focus-visible:opacity-100"
      />
    </div>
  )
}
