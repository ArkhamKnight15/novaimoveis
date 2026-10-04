import { Spinner } from '../ui/Spinner'

/** Exibido enquanto o código de uma página é carregado (code splitting). */
export function PageFallback() {
  return (
    <div role="status" className="flex min-h-[70svh] items-center justify-center gap-3 pt-24 text-sm text-graphite-500">
      <Spinner />
      Carregando…
    </div>
  )
}
