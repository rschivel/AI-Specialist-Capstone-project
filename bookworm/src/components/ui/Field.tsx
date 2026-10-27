import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'

const control =
  'w-full bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder:text-subtle border-b border-subtle focus:border-b-brand'

interface FieldShellProps {
  id: string
  label: string
  error?: string
  hideLabel?: boolean
  className?: string
  children: ReactNode
}

function FieldShell({ id, label, error, hideLabel, className = '', children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mb-1 block text-xs text-muted'}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hideLabel?: boolean
  wrapperClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hideLabel, wrapperClassName, className = '', ...rest },
  ref,
) {
  const id = useId()
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${control} ${error ? 'border-b-danger' : ''} ${className}`}
        {...rest}
      />
    </FieldShell>
  )
})

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hideLabel?: boolean
  wrapperClassName?: string
  options: readonly { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hideLabel, wrapperClassName, options, className = '', ...rest },
  ref,
) {
  const id = useId()
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${control} ${error ? 'border-b-danger' : ''} ${className}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
})
