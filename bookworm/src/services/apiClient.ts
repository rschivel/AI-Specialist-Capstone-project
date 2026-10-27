import axios from 'axios'
import { mockAdapter } from './mockAdapter'

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined

if (
  baseURL &&
  !/^https:\/\//.test(baseURL) &&
  !/^http:\/\/(localhost|127\.0\.0\.1)/.test(baseURL)
) {
  throw new Error('VITE_API_BASE_URL must use https:// (http is allowed for localhost only).')
}

/**
 * Single Axios instance for the app. Without VITE_API_BASE_URL the in-browser mock adapter
 * answers requests, so swapping in a real backend needs no UI changes.
 */
export const apiClient = axios.create({
  baseURL: baseURL || undefined,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  ...(baseURL ? {} : { adapter: mockAdapter }),
})
