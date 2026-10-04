import { useMemo, type ReactNode } from 'react'
import { propertyTypeOptions } from '../../data/catalog'
import { pluralize } from '../../lib/format'
import type { PropertyQuery, Purpose } from '../../types/property'
import { ChipGroup } from '../ui/ChipGroup'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Select } from '../ui/Select'
import { NumberInput } from './NumberInput'
import { useLocationOptions } from '../../hooks/useLocationOptions'

interface FiltersPanelProps {
  query: PropertyQuery
  onChange: (patch: Partial<PropertyQuery>) => void
  onPurposeChange: (purpose: Purpose | undefined) => void
}

const countOptions = [
  { value: '0', label: 'Todos' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="eyebrow float-left mb-4 w-full text-[0.625rem] text-graphite-500">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  )
}

/** Todos os filtros da busca. Cada alteração atualiza a URL (compartilhável) e a lista. */
export function FiltersPanel({ query, onChange, onPurposeChange }: FiltersPanelProps) {
  const locationOptions = useLocationOptions()
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
  const isRent = query.purpose === 'aluguel'

  return (
    <div className="space-y-6">
      <SegmentedControl
        label="Finalidade"
        block
        value={query.purpose ?? 'todos'}
        options={[
          { value: 'todos', label: 'Todos' },
          { value: 'venda', label: 'Comprar' },
          { value: 'aluguel', label: 'Alugar' },
        ]}
        onChange={(value) => onPurposeChange(value === 'todos' ? undefined : value)}
      />

      <Group title="Localização">
        <Select
          label="Cidade ou bairro"
          hideLabel
          value={query.location ?? ''}
          options={locations}
          onChange={(location) => onChange({ location: location || undefined })}
        />
      </Group>

      <Group title="Tipo de imóvel">
        <ChipGroup
          label="Tipo de imóvel"
          hideLabel
          options={propertyTypeOptions}
          value={query.type}
          onChange={(type) => onChange({ type })}
        />
      </Group>

      <Group title={isRent ? 'Aluguel mensal' : 'Preço'}>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Mínimo"
            prefix="R$"
            placeholder="0"
            value={query.priceMin}
            onChange={(priceMin) => onChange({ priceMin })}
          />
          <NumberInput
            label="Máximo"
            prefix="R$"
            placeholder="Sem limite"
            value={query.priceMax}
            onChange={(priceMax) => onChange({ priceMax })}
          />
        </div>
      </Group>

      <Group title="Cômodos">
        <div className="space-y-5">
          {(
            [
              ['bedrooms', 'Quartos'],
              ['bathrooms', 'Banheiros'],
              ['parking', 'Vagas'],
            ] as const
          ).map(([key, label]) => (
            <SegmentedControl
              key={key}
              label={label}
              hideLabel={false}
              size="sm"
              block
              value={String(query[key] ?? 0)}
              options={countOptions}
              onChange={(value) => onChange({ [key]: Number(value) || undefined })}
            />
          ))}
        </div>
      </Group>

      <Group title="Área privativa">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Mínima"
            suffix="m²"
            placeholder="0"
            value={query.areaMin}
            onChange={(areaMin) => onChange({ areaMin })}
          />
          <NumberInput
            label="Máxima"
            suffix="m²"
            placeholder="Sem limite"
            value={query.areaMax}
            onChange={(areaMax) => onChange({ areaMax })}
          />
        </div>
      </Group>
    </div>
  )
}
