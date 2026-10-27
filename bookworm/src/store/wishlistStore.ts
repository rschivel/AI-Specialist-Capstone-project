import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  bookIds: string[]
  toggle: (bookId: string) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      bookIds: [],
      toggle: (bookId) =>
        set((state) => ({
          bookIds: state.bookIds.includes(bookId)
            ? state.bookIds.filter((id) => id !== bookId)
            : [...state.bookIds, bookId],
        })),
    }),
    { name: 'bookworm.wishlist' },
  ),
)
