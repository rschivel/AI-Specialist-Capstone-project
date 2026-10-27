import { useEffect, useState } from 'react'
import { getErrorMessage } from '../services'

interface AsyncState<T> {
  data: T | undefined
  error: string | null
  loading: boolean
}

/** Runs `load` whenever `deps` change, ignoring results from superseded requests. */
export function useAsync<T>(load: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: null, loading: true })

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to loading when inputs change
    setState((prev) => ({ ...prev, loading: true, error: null }))
    load()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((e: unknown) => {
        if (!cancelled) setState({ data: undefined, error: getErrorMessage(e), loading: false })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies the dependency list
  }, deps)

  return state
}
