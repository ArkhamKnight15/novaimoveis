import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

/** Anima um número de 0 até `target` quando `active` vira true. */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const reducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active || reducedMotion) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration, reducedMotion])

  // Com redução de movimento, o número final aparece direto, sem animação.
  return active && reducedMotion ? target : value
}
