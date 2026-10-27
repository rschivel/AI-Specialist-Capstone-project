export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 p-6 text-muted">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-subtle border-t-brand"
      />
      <span>{label}…</span>
    </div>
  )
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="m-6 border-l-4 border-danger bg-surface p-4 text-danger">
      {message}
    </p>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="p-10 text-center">
      <p className="text-lg text-ink">{title}</p>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
    </div>
  )
}
