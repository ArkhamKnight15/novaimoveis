import {
  ArrowUpDown,
  Bike,
  Blocks,
  Briefcase,
  Building2,
  Clapperboard,
  Cpu,
  Dumbbell,
  Flame,
  Laptop,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Trees,
  Trophy,
  UtensilsCrossed,
  Waves,
  Wine,
  type LucideIcon,
} from 'lucide-react'
import { amenityLabels } from '../../data/catalog'
import type { AmenityId } from '../../types/property'

const icons: Record<AmenityId, LucideIcon> = {
  piscina: Waves,
  'piscina-aquecida': ThermometerSun,
  academia: Dumbbell,
  spa: Sparkles,
  jardim: Trees,
  churrasqueira: UtensilsCrossed,
  adega: Wine,
  'home-office': Laptop,
  cinema: Clapperboard,
  brinquedoteca: Blocks,
  portaria: ShieldCheck,
  pet: PawPrint,
  bicicletario: Bike,
  coworking: Briefcase,
  rooftop: Building2,
  automacao: Cpu,
  'energia-solar': Sun,
  'vista-mar': Waves,
  lareira: Flame,
  'elevador-privativo': ArrowUpDown,
  quadra: Trophy,
  praia: Sun,
}

export function AmenityList({ amenities }: { amenities: AmenityId[] }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
      {amenities.map((amenity) => {
        const Icon = icons[amenity]
        return (
          <li
            key={amenity}
            className="flex items-center gap-3 border-b border-r border-line px-4 py-5 text-[0.875rem] text-graphite-700"
          >
            <Icon aria-hidden="true" className="size-5 shrink-0 text-gold-600" strokeWidth={1.25} />
            {amenityLabels[amenity]}
          </li>
        )
      })}
    </ul>
  )
}
