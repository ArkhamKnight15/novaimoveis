import type { ImageAsset } from '../types/property'

const DEFAULT_WIDTHS = [800, 1600] as const

interface ImageOptions {
  width?: number
  height?: number
  widths?: readonly number[]
}

/**
 * Monta um ImageAsset a partir da convenção de arquivos em /public/images:
 * `<caminho>-<largura>.webp` (ex.: properties/residencia-jacaranda/01-800.webp).
 * Para trocar uma imagem, basta substituir os arquivos mantendo os nomes —
 * ou declarar `src`/`srcSet` manualmente nos dados.
 */
export function image(path: string, alt: string, options: ImageOptions = {}): ImageAsset {
  const { width = 1600, height = 1067, widths = DEFAULT_WIDTHS } = options
  const largest = widths[widths.length - 1] ?? width
  return {
    src: `/images/${path}-${largest}.webp`,
    srcSet: widths.map((w) => `/images/${path}-${w}.webp ${w}w`).join(', '),
    width,
    height,
    alt,
  }
}
