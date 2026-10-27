import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useCartStore } from './store/cartStore'
import { useCheckoutStore } from './store/checkoutStore'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('App flows', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
    useCheckoutStore.getState().reset()
  })

  it('shows the catalogue sections with books', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Recommended for You' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bestsellers this Month' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New Launches' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'The Art of Focus' })).toBeInTheDocument()
  })

  it('filters the catalogue by search text', async () => {
    renderAt('/')
    await screen.findByRole('heading', { name: 'Recommended for You' })

    await userEvent.type(screen.getByLabelText('Search you want to read here'), 'kitten')

    expect(await screen.findByRole('heading', { name: '1 result' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'The Lost Kitten' })).toBeInTheDocument()
  })

  it('filters by category from the sidebar', async () => {
    renderAt('/')
    await screen.findByRole('heading', { name: 'Recommended for You' })

    await userEvent.click(screen.getByRole('button', { name: 'Romance' }))

    expect(await screen.findByRole('link', { name: 'Beneath the Stars' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('link', { name: 'The Lost Kitten' })).toBeNull())
  })

  it('adds a book to the cart from its detail page and shows related reads', async () => {
    renderAt('/books/joy-of-minimalism')
    expect(
      await screen.findByRole('heading', { name: 'Joy of Minimalism', level: 1 }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Related Reads' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }))

    expect(useCartStore.getState().items).toEqual([{ bookId: 'joy-of-minimalism', quantity: 1 }])
    expect(screen.getByRole('link', { name: /Shopping cart, 1 item/ })).toBeInTheDocument()
  })

  it('shows an empty cart message at checkout', async () => {
    renderAt('/checkout')
    expect(await screen.findByText('Your shopping cart is empty')).toBeInTheDocument()
  })

  it('computes totals, applies a coupon, and validates the address before payment', async () => {
    useCartStore.getState().add('joy-of-minimalism')
    useCartStore.getState().add('the-path-to-success')
    renderAt('/checkout')

    const summary = await screen.findByRole('region', { name: 'Grand Total' })
    expect(within(summary).getByText('₹508')).toBeInTheDocument()
    expect(within(summary).getByText('₹61')).toBeInTheDocument()
    expect(within(summary).getByText('Free')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Apply Coupon'), 'bookworm100')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText('Coupon BOOKWORM100 applied.')).toBeInTheDocument()
    expect(within(summary).getByText('₹469')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Pay Now' }))
    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Enter a 6-digit PIN code')).toBeInTheDocument()
  })

  it('rejects an invalid coupon', async () => {
    useCartStore.getState().add('joy-of-minimalism')
    renderAt('/checkout')
    await userEvent.type(await screen.findByLabelText('Apply Coupon'), 'nope')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText('Invalid coupon code')).toBeInTheDocument()
  })

  it('redirects the payment page to checkout when no address was entered', async () => {
    useCartStore.getState().add('joy-of-minimalism')
    renderAt('/payment')
    expect(await screen.findByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument()
  })

  it('shows 404 for unknown routes', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
