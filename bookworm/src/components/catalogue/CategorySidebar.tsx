import { CATEGORIES } from '../../constants'

interface CategorySidebarProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategorySidebar({ selected, onSelect }: CategorySidebarProps) {
  return (
    <nav
      aria-label="Categories"
      className="flex gap-1 overflow-x-auto bg-surface p-2 lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-visible lg:p-0"
    >
      {CATEGORIES.map((category) => {
        const active = category === selected
        return (
          <button
            key={category}
            type="button"
            aria-current={active ? 'true' : undefined}
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap border-l-2 px-3 py-2 text-left text-xs ${
              active
                ? 'border-brand bg-surface-2 font-semibold text-white'
                : 'border-transparent text-muted hover:bg-surface-2'
            }`}
          >
            {category}
          </button>
        )
      })}
    </nav>
  )
}
