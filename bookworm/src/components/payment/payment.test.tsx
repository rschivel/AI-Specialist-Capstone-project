import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CardForm, UpiForm } from './PaymentForms'

describe('CardForm', () => {
  it('blocks submission and shows errors for invalid card details', async () => {
    const onSubmit = vi.fn()
    render(<CardForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Card Number'), '1234 5678 9012 3456')
    await userEvent.type(screen.getByLabelText('CVV'), '1')
    await userEvent.click(screen.getByRole('button', { name: 'Pay Now' }))

    expect(await screen.findByText('Enter a valid card number')).toBeInTheDocument()
    expect(screen.getByText('Enter a 3 or 4 digit CVV')).toBeInTheDocument()
    expect(screen.getByText('Use the format MM/YYYY')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid details', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CardForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Card Number'), '4242 4242 4242 4242')
    await userEvent.type(screen.getByLabelText('Name on Card'), 'Asha Rao')
    await userEvent.type(screen.getByLabelText('CVV'), '123')
    await userEvent.type(screen.getByLabelText('Date of Expiry'), '12/2099')
    await userEvent.click(screen.getByRole('button', { name: 'Pay Now' }))

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nameOnCard: 'Asha Rao', expiry: '12/2099' })
  })

  it('masks the CVV field', () => {
    render(<CardForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('CVV')).toHaveAttribute('type', 'password')
  })
})

describe('UpiForm', () => {
  it('validates the UPI id', async () => {
    const onSubmit = vi.fn()
    render(<UpiForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('UPI ID'), 'bad id')
    await userEvent.click(screen.getByRole('button', { name: 'Pay Now' }))

    expect(await screen.findByText('Enter a valid UPI ID')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
