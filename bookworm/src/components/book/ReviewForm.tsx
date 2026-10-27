import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { bookService, getErrorMessage } from '../../services'
import { reviewSchema, type ReviewFormValues } from '../../schemas/order'
import type { Review } from '../../types'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'

interface ReviewFormProps {
  bookId: string
  onSubmitted: (review: Review) => void
}

const MAX_LENGTH = 100

export function ReviewForm({ bookId, onSubmitted }: ReviewFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, text: '' },
  })
  const length = useWatch({ control, name: 'text' })?.length ?? 0

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      onSubmitted(await bookService.addReview(bookId, values))
      reset()
    } catch (e) {
      setSubmitError(getErrorMessage(e))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Leave your review" className="space-y-2">
      <div className="flex justify-between text-xs text-muted">
        <label htmlFor="review-text">Leave Your Review</label>
        <span aria-live="polite">
          {length}/{MAX_LENGTH}
        </span>
      </div>
      <textarea
        id="review-text"
        rows={5}
        maxLength={MAX_LENGTH}
        placeholder="Placeholder text"
        aria-invalid={errors.text ? true : undefined}
        aria-describedby={errors.text ? 'review-text-error' : undefined}
        className="w-full resize-y bg-surface-2 p-3 text-sm text-ink placeholder:text-subtle"
        {...register('text')}
      />
      {errors.text && (
        <p id="review-text-error" role="alert" className="text-xs text-danger">
          {errors.text.message}
        </p>
      )}
      <div className="flex items-center justify-between">
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
        />
        <Button type="submit" loading={isSubmitting}>
          Submit →
        </Button>
      </div>
      {errors.rating && (
        <p role="alert" className="text-xs text-danger">
          {errors.rating.message}
        </p>
      )}
      {submitError && (
        <p role="alert" className="text-xs text-danger">
          {submitError}
        </p>
      )}
    </form>
  )
}
