interface StarRatingProps {
  value: number
  /** When provided the stars become an accessible radio group. */
  onChange?: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]

  if (!onChange) {
    return (
      <span role="img" aria-label={`Rated ${value} out of 5`} className="text-yellow-400">
        {stars.map((s) => (s <= Math.round(value) ? '★' : '☆')).join('')}
      </span>
    )
  }

  return (
    <div role="radiogroup" aria-label="Your rating" className="flex">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={s === value}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
          onClick={() => onChange(s)}
          className="px-0.5 text-xl text-yellow-400"
        >
          {s <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
