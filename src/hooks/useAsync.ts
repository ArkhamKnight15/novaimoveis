import { useCallback, useEffect, useState, type DependencyList } from 'react'

type AsyncState<T> =
  | { status: 'loading'; data: T | undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: T | undefined; error: Error }

/**
 * Executa uma função assíncrona cancelável e expõe os estados de carregamento, sucesso e erro.
 * Mantém o último resultado durante um novo carregamento (útil para filtros).
 */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: undefined, error: undefined })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((previous) => ({ status: 'loading', data: previous.data, error: undefined }))
    fn(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data, error: undefined })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        setState((previous) => ({
          status: 'error',
          data: previous.data,
          error: error instanceof Error ? error : new Error('Erro inesperado.'),
        }))
      },
    )
    return () => controller.abort()
    // `fn` é recriada a cada render; as dependências reais são passadas explicitamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])
  return { ...state, retry }
}
