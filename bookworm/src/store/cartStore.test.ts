import { beforeEach, describe, expect, it } from 'vitest'
import { selectCartCount, useCartStore } from './cartStore'

describe('cartStore', () => {
  beforeEach(() => useCartStore.getState().clear())

  it('adds a book once and increments quantity on repeat adds', () => {
    const { add } = useCartStore.getState()
    add('a')
    add('a')
    add('b')
    expect(useCartStore.getState().items).toEqual([
      { bookId: 'a', quantity: 2 },
      { bookId: 'b', quantity: 1 },
    ])
    expect(selectCartCount(useCartStore.getState())).toBe(3)
  })

  it('clamps quantity between 1 and 10', () => {
    const { add, setQuantity } = useCartStore.getState()
    add('a')
    setQuantity('a', 0)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
    setQuantity('a', 99)
    expect(useCartStore.getState().items[0].quantity).toBe(10)
  })

  it('removes and clears items', () => {
    const { add, remove, clear } = useCartStore.getState()
    add('a')
    add('b')
    remove('a')
    expect(useCartStore.getState().items.map((i) => i.bookId)).toEqual(['b'])
    clear()
    expect(useCartStore.getState().items).toEqual([])
  })
})
