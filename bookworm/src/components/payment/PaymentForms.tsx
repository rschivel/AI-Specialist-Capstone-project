import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { WALLETS } from '../../constants'
import {
  cardSchema,
  upiSchema,
  walletSchema,
  type CardFormValues,
  type UpiFormValues,
  type WalletFormValues,
} from '../../schemas/payment'
import { Button } from '../ui/Button'
import { SelectField, TextField } from '../ui/Field'

interface FormProps<T> {
  onSubmit: (values: T) => Promise<void>
}

function PayButton({ busy }: { busy: boolean }) {
  return (
    <div className="flex justify-end">
      <Button type="submit" loading={busy}>
        Pay Now
      </Button>
    </div>
  )
}

export function CardForm({ onSubmit }: FormProps<CardFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({ resolver: zodResolver(cardSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Card Number"
        placeholder="XXXX-XXXX-XXXX-XXXX"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={23}
        error={errors.cardNumber?.message}
        {...register('cardNumber')}
      />
      <TextField
        label="Name on Card"
        placeholder="Name"
        autoComplete="cc-name"
        maxLength={60}
        error={errors.nameOnCard?.message}
        {...register('nameOnCard')}
      />
      <TextField
        label="CVV"
        type="password"
        placeholder="XXX"
        inputMode="numeric"
        autoComplete="cc-csc"
        maxLength={4}
        error={errors.cvv?.message}
        {...register('cvv')}
      />
      <TextField
        label="Date of Expiry"
        placeholder="MM/YYYY"
        autoComplete="cc-exp"
        maxLength={7}
        error={errors.expiry?.message}
        {...register('expiry')}
      />
      <div className="sm:col-span-2">
        <PayButton busy={isSubmitting} />
      </div>
    </form>
  )
}

export function UpiForm({ onSubmit }: FormProps<UpiFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpiFormValues>({ resolver: zodResolver(upiSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <TextField
        label="UPI ID"
        placeholder="name@bank"
        autoComplete="off"
        maxLength={100}
        error={errors.upiId?.message}
        {...register('upiId')}
      />
      <PayButton busy={isSubmitting} />
    </form>
  )
}

export function WalletForm({ onSubmit }: FormProps<WalletFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WalletFormValues>({ resolver: zodResolver(walletSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <SelectField
        label="Wallet"
        options={[
          { value: '', label: 'Select a wallet' },
          ...WALLETS.map((w) => ({ value: w, label: w })),
        ]}
        error={errors.wallet?.message}
        {...register('wallet')}
      />
      <PayButton busy={isSubmitting} />
    </form>
  )
}
