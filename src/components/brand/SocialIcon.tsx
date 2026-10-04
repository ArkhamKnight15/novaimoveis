import type { ReactNode } from 'react'
import type { SocialId } from '../../data/company'

const paths: Record<SocialId, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1.1-2.8 2.6-2.8s2.4 1 2.4 2.8V17" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4v5.2l4.4-2.6-4.4-2.6Z" fill="currentColor" stroke="none" />
    </>
  ),
}

/** Ícones de redes sociais no mesmo traço dos ícones Lucide (o Lucide 1.x não inclui marcas). */
export function SocialIcon({ id, className }: { id: SocialId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[id]}
    </svg>
  )
}
