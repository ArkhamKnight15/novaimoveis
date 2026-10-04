/** URL base da API real. Sem ela, os serviços usam os dados mockados de `src/data`. */
export const API_URL: string | undefined = import.meta.env.VITE_API_URL || undefined

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init.headers },
  })
  if (!response.ok) throw new ApiError(`Falha na requisição (${response.status}).`, response.status)
  return (await response.json()) as T
}

/** Simula a latência de rede da API para que os estados de carregamento sejam exercitados. */
export function simulateLatency<T>(produce: () => T, signal?: AbortSignal, ms = 450): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const timer = window.setTimeout(() => {
      try {
        resolve(produce())
      } catch (error) {
        reject(error)
      }
    }, ms)
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}
