import { Search } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { priceRanges, propertyTypeOptions } from '../../data/catalog'
import { cn } from '../../lib/cn'
import { buildSearchUrl } from '../../lib/filters'
import { pluralize } from '../../lib/format'
import type { PropertyType, Purpose } from '../../types/property'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Select } from '../ui/Select'
import { useLocationOptions } from '../../hooks/useLocationOptions'

const bedroomOptions = [
  { value: '', label: 'Qualquer' },
  { value: '1', label: '1 ou mais' },
  { value: '2', label: '2 ou mais' },
  { value: '3', label: '3 ou mais' },
  { value: '4', label: '4 ou mais' },
]

/**
 * Busca rápida do hero. No desktop é uma barra única com células separadas por fios;
 * no celular vira um cartão empilhado. Envia para /comprar ou /alugar com os filtros na URL.
 */
export function HeroSearch({ className }: { className?: string }) {
  const navigate = useNavigate()
  const locationOptions = useLocationOptions()
  const [purpose, setPurpose] = useState<Purpose>('venda')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [price, setPrice] = useState('')

  const locations = useMemo(
    () => [
      { value: '', label: 'Todas as regiões' },
      ...locationOptions.map((option) => ({
        value: option.value,
        label: option.city ? `${option.label}, ${option.city}` : option.label,
        hint: pluralize(option.count, 'imóvel', 'imóveis'),
        group: option.city ? 'Bairros' : 'Cidades',
      })),
    ],
    [locationOptions],
  )
  const types = [{ value: '', label: 'Todos os tipos' }, ...propertyTypeOptions]
  const prices = [{ value: '', label: 'Qualquer valor' }, ...priceRanges[purpose]]

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const range = priceRanges[purpose].find((option) => option.value === price)
    navigate(
      buildSearchUrl({
        purpose,
        location: location || undefined,
        type: (type || undefined) as PropertyType | undefined,
        bedrooms: Number(bedrooms) || undefined,
        priceMin: range?.min,
        priceMax: range?.max,
      }),
    )
  }

  const cell = 'border-line px-5 py-4 lg:border-l lg:px-6 lg:py-0'

  return (
    <form
      role="search"
      aria-label="Buscar imóveis"
      onSubmit={onSubmit}
      className={cn(
        'bg-paper text-ink shadow-float lg:flex lg:h-[5.5rem] lg:items-stretch lg:rounded-[2px]',
        className,
      )}
    >
      <div className="flex items-center border-b border-line px-5 py-4 lg:border-b-0 lg:px-5">
        <SegmentedControl
          label="Finalidade"
          tone="light"
          size="sm"
          block
          value={purpose}
          options={[
            { value: 'venda', label: 'Comprar' },
            { value: 'aluguel', label: 'Alugar' },
          ]}
          onChange={(value) => {
            setPurpose(value)
            setPrice('')
          }}
          className="lg:w-44"
        />
      </div>
      <div className="grid grid-cols-2 lg:flex lg:flex-1">
        <Select
          variant="hero"
          label="Localização"
          value={location}
          options={locations}
          onChange={setLocation}
          className={cn(cell, 'col-span-2 border-b lg:flex lg:flex-[1.4] lg:flex-col lg:justify-center lg:border-b-0')}
        />
        <Select
          variant="hero"
          label="Tipo de imóvel"
          value={type}
          options={types}
          onChange={setType}
          className={cn(
            cell,
            'border-b border-r lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r-0',
          )}
        />
        <Select
          variant="hero"
          label="Quartos"
          value={bedrooms}
          options={bedroomOptions}
          onChange={setBedrooms}
          className={cn(cell, 'border-b lg:flex lg:flex-[0.8] lg:flex-col lg:justify-center lg:border-b-0')}
        />
        <Select
          variant="hero"
          label="Faixa de preço"
          value={price}
          options={prices}
          onChange={setPrice}
          className={cn(cell, 'col-span-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center')}
        />
      </div>
      <div className="p-3 lg:p-2">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          block
          icon={<Search aria-hidden="true" className="size-4" strokeWidth={1.5} />}
          className="lg:h-full lg:px-9"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
