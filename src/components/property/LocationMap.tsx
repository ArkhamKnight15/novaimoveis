import { ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import type { Property } from '../../types/property'

/** Gerador pseudoaleatório determinístico (mulberry32): o mesmo imóvel gera sempre o mesmo mapa. */
function random(seedText: string) {
  let seed = [...seedText].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 7)
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const COASTAL = ['Leblon', 'Jurerê Internacional']

/**
 * Mapa ilustrativo (sem serviço externo): ruas, um parque e, nas cidades litorâneas, o mar.
 * Mostra a localização aproximada — o endereço exato é enviado após o agendamento.
 */
export function LocationMap({ property }: { property: Property }) {
  const { neighborhood, city, state, coordinates } = property.location
  const shapes = useMemo(() => {
    const rand = random(property.id)
    const angle = rand() * 30 - 15
    const streets = Array.from({ length: 14 }, (_, i) => ({ offset: -100 + i * 75 + rand() * 20, major: i % 4 === 1 }))
    const cross = Array.from({ length: 10 }, (_, i) => ({ offset: -60 + i * 70 + rand() * 25, major: i % 3 === 2 }))
    const park = { x: 80 + rand() * 420, y: 40 + rand() * 120, w: 120 + rand() * 90, h: 80 + rand() * 60 }
    const avenue = 120 + rand() * 200
    return { angle, streets, cross, park, avenue }
  }, [property.id])
  const coastal = COASTAL.includes(neighborhood)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`

  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden bg-[#ece8df]">
        <svg viewBox="0 0 800 450" className="absolute inset-0 size-full" aria-hidden="true">
          <g transform={`rotate(${shapes.angle} 400 225)`}>
            <rect
              x={shapes.park.x}
              y={shapes.park.y}
              width={shapes.park.w}
              height={shapes.park.h}
              rx="18"
              fill="#d9dfcf"
            />
            {shapes.streets.map((street) => (
              <line
                key={`v${street.offset}`}
                x1={street.offset}
                y1={-200}
                x2={street.offset}
                y2={650}
                stroke="#fbfaf7"
                strokeWidth={street.major ? 9 : 4}
              />
            ))}
            {shapes.cross.map((street) => (
              <line
                key={`h${street.offset}`}
                x1={-200}
                y1={street.offset}
                x2={1000}
                y2={street.offset}
                stroke="#fbfaf7"
                strokeWidth={street.major ? 9 : 4}
              />
            ))}
            <path
              d={`M-200 ${shapes.avenue + 260} C 200 ${shapes.avenue + 120}, 500 ${shapes.avenue + 260}, 1000 ${shapes.avenue}`}
              fill="none"
              stroke="#f5efe2"
              strokeWidth="16"
            />
          </g>
          {coastal && <path d="M0 360 C 180 330, 360 395, 520 368 S 760 340, 800 352 V450 H0 Z" fill="#cfd9dc" />}
          <circle cx="400" cy="225" r="60" fill="#a68b5b" fillOpacity="0.12" />
          <circle cx="400" cy="225" r="34" fill="#a68b5b" fillOpacity="0.16" className="origin-center animate-pulse" />
          <circle cx="400" cy="225" r="9" fill="#11100e" stroke="#fbfaf7" strokeWidth="4" />
        </svg>
        <div className="absolute left-4 top-4 bg-paper/95 px-4 py-3 shadow-panel">
          <p className="font-editorial text-lg leading-none text-ink">{neighborhood}</p>
          <p className="mt-1.5 text-[0.75rem] text-graphite-500">
            {city} – {state}
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-[0.75rem] font-medium text-paper transition-colors hover:bg-graphite-800"
        >
          Ver região no Google Maps <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        </a>
      </div>
      <figcaption className="mt-3 text-[0.8125rem] text-graphite-500">
        Mapa ilustrativo com a localização aproximada. O endereço completo é enviado após o agendamento da visita.
      </figcaption>
    </figure>
  )
}
