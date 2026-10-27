import { FORMATS, LANGUAGES, PRICE_RANGES, SORT_OPTIONS } from '../../constants'
import { SelectField, TextField } from '../ui/Field'

export interface FilterValues {
  language: string
  format: string
  priceRange: string
  sort: string
}

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  values: FilterValues
  onChange: (key: keyof FilterValues, value: string) => void
}

const withAll = (items: readonly string[]) => [
  { value: 'All', label: 'All' },
  ...items.map((i) => ({ value: i, label: i })),
]

export function FilterBar({ search, onSearchChange, values, onChange }: FilterBarProps) {
  return (
    <form
      role="search"
      aria-label="Filter books"
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-2 gap-3 md:grid-cols-6"
    >
      <TextField
        label="Search you want to read here"
        type="search"
        placeholder="Search"
        maxLength={100}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        wrapperClassName="col-span-2 md:col-span-2"
      />
      <SelectField
        label="Language"
        value={values.language}
        onChange={(e) => onChange('language', e.target.value)}
        options={withAll(LANGUAGES)}
      />
      <SelectField
        label="Format (Paperback, ebook etc)"
        value={values.format}
        onChange={(e) => onChange('format', e.target.value)}
        options={withAll(FORMATS)}
      />
      <SelectField
        label="Price Range"
        value={values.priceRange}
        onChange={(e) => onChange('priceRange', e.target.value)}
        options={PRICE_RANGES.map((r) => ({ value: r.value, label: r.label }))}
      />
      <SelectField
        label="Sort by"
        value={values.sort}
        onChange={(e) => onChange('sort', e.target.value)}
        options={SORT_OPTIONS}
      />
    </form>
  )
}
