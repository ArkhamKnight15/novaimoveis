import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { heroMedia } from '../../data/media'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

type VideoState = 'waiting' | 'playing' | 'failed'

interface NetworkInformation {
  saveData?: boolean
  effectiveType?: string
}

/** O vídeo só é considerado em conexões sem economia de dados e fora do 2G. */
function connectionAllowsVideo(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  return !connection?.saveData && !/(^|-)2g$/.test(connection?.effectiveType ?? '')
}

/** Executa quando o navegador estiver ocioso, depois do carregamento da página. */
function whenIdle(callback: () => void): () => void {
  let cancelled = false
  const run = () => {
    if (cancelled) return
    // Safari ainda não implementa requestIdleCallback.
    const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (idle) idle(() => !cancelled && callback(), { timeout: 2000 })
    else setTimeout(() => !cancelled && callback(), 300)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', run)
  }
}

/**
 * Fundo cinematográfico do hero.
 * 1. A imagem (poster) aparece imediatamente e é o LCP da página, com um push-in lento.
 * 2. Depois do carregamento, se a conexão permitir e não houver redução de movimento,
 *    o vídeo é carregado e entra com um fade quando começa a tocar.
 * 3. Se o arquivo não existir ou falhar, a imagem continua — o layout não depende do vídeo.
 * O vídeo pausa fora da tela e pode ser pausado pelo usuário (WCAG 2.2.2).
 */
export function HeroMedia() {
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [state, setState] = useState<VideoState>('waiting')
  const [paused, setPaused] = useState(false)
  const source = isMobile ? heroMedia.video.mobile : heroMedia.video.desktop

  useEffect(() => {
    if (reducedMotion || !connectionAllowsVideo()) return
    return whenIdle(() => setShouldLoad(true))
  }, [reducedMotion])

  // Pausa quando o hero sai da tela (economiza CPU e bateria) e respeita a pausa manual.
  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return
    const sync = (visible: boolean) => {
      if (visible && !paused) video.play().catch(() => setState('failed'))
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => sync(Boolean(entry?.isIntersecting)), { threshold: 0.05 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [shouldLoad, paused, source])

  const videoVisible = state === 'playing'
  const motionPaused = paused || reducedMotion

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden bg-graphite-900">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={heroMedia.posterMobile.srcSet}
            sizes="100vw"
            width={heroMedia.posterMobile.width}
            height={heroMedia.posterMobile.height}
          />
          <ResponsiveImage
            image={heroMedia.poster}
            sizes="100vw"
            priority
            className={cn(
              'absolute inset-0 size-full object-cover object-[60%_center] will-change-transform',
              !reducedMotion && 'animate-hero-push',
            )}
            style={{ animationPlayState: motionPaused ? 'paused' : 'running' }}
          />
        </picture>

        {shouldLoad && state !== 'failed' && (
          <video
            key={source}
            ref={videoRef}
            className={cn(
              'absolute inset-0 size-full object-cover object-[60%_center] transition-opacity duration-[1600ms] ease-out-quart',
              videoVisible ? 'opacity-100' : 'opacity-0',
            )}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setState('playing')}
            onError={() => setState('failed')}
          >
            <source src={source} type="video/mp4" onError={() => setState('failed')} />
          </video>
        )}
      </div>

      {!reducedMotion && (
        <button
          type="button"
          onClick={() => {
            const next = !paused
            setPaused(next)
            const video = videoRef.current
            if (video) {
              if (next) video.pause()
              else video.play().catch(() => undefined)
            }
          }}
          aria-pressed={paused}
          aria-label={paused ? 'Retomar movimento do fundo' : 'Pausar movimento do fundo'}
          className="absolute right-5 top-24 z-20 hidden size-9 items-center justify-center rounded-full border border-white/25 text-white/80 backdrop-blur-sm transition-colors duration-300 hover:border-white/60 hover:text-white md:flex lg:right-8 lg:top-28"
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          ) : (
            <Pause aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          )}
        </button>
      )}
    </>
  )
}
