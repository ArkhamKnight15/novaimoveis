import { useEffect, useState } from 'react'
import { getLocations } from '../services/properties'
import type { LocationOption } from '../types/property'

/** Opções de localização (cidades e bairros) carregadas uma única vez e compartilhadas. */
export function useLocationOptions(): LocationOption[] {
  const [options, setOptions] = useState<LocationOption[]>([])

  useEffect(() => {
    let active = true
    getLocations().then(
      (result) => active && setOptions(result),
      () => undefined,
    )
    return () => {
      active = false
    }
  }, [])

  return options
}
