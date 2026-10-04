import { extendTailwindMerge, type ClassNameValue } from 'tailwind-merge'

/**
 * O tailwind-merge precisa conhecer os tamanhos tipográficos do tema (src/index.css);
 * sem isso, `text-display-md` seria tratado como cor e descartado ao lado de `text-white`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'eyebrow'],
    },
  },
})

/** Junta classes condicionais; em conflitos (ex.: `flex` x `hidden`), a última classe vence. */
export function cn(...classes: ClassNameValue[]): string {
  return twMerge(classes)
}
