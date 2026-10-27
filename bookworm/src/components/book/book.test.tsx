import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { books } from '../../data/books'
import { BookCard } from './BookCard'
import { ReviewForm } from './ReviewForm'

describe('BookCard', () => {
  const book = books.find((b) => b.id === 'joy-of-minimalism')!

  it('shows title, author, price and links to the detail page', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Joy of Minimalism' })).toHaveAttribute(
      'href',
      '/books/joy-of-minimalism',
    )
    expect(screen.getAllByText('Daniel Reed').length).toBeGreaterThan(0)
    expect(screen.getByText('₹149')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Self Help' })).toBeInTheDocument()
  })
})

describe('ReviewForm', () => {
  it('shows validation errors and does not submit an empty review', async () => {
    const onSubmitted = vi.fn()
    render(<ReviewForm bookId="joy-of-minimalism" onSubmitted={onSubmitted} />)

    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText('Write a short review')).toBeInTheDocument()
    expect(onSubmitted).not.toHaveBeenCalled()
  })

  it('submits a valid review through the service layer', async () => {
    const onSubmitted = vi.fn()
    render(<ReviewForm bookId="joy-of-minimalism" onSubmitted={onSubmitted} />)

    await userEvent.type(screen.getByLabelText('Leave Your Review'), 'Loved it')
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await vi.waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1))
    expect(onSubmitted.mock.calls[0][0]).toMatchObject({ text: 'Loved it', rating: 4 })
  })
})
