import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ImageAsset } from '../../types/property'

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  image: ImageAsset
  /** Tamanhos exibidos, ex.: "(min-width: 1024px) 33vw, 100vw". */
  sizes: string
  /** Carrega com prioridade (imagem principal acima da dobra). */
  priority?: boolean
  /** Sobrescreve o alt do dado (ex.: imagens decorativas com alt=""). */
  alt?: string
}

/**
 * Imagem com dimensões intrínsecas (sem layout shift), srcset responsivo, lazy loading
 * e fade-in suave quando termina de carregar.
 */
export function ResponsiveImage({ image, sizes, priority, alt, className, onLoad, ...props }: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      ref={(node) => {
        if (node?.complete && node.naturalWidth > 0) setLoaded(true)
      }}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      className={cn('transition-opacity duration-700 ease-out-quart', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...props}
    />
  )
}
