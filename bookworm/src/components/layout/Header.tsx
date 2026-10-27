import { Link, NavLink } from 'react-router-dom'
import { selectCartCount, useCartStore } from '../../store/cartStore'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-3 text-xs hover:text-white ${isActive ? 'text-white' : 'text-muted'}`

export function Header() {
  const count = useCartStore(selectCartCount)

  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 py-3 pr-3 text-xs font-bold text-white">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-current">
            <path d="M2 2h12v12H2V2Zm1.5 1.5v9h9v-9h-9ZM5 5h6v1.5H5V5Zm0 2.5h6V9H5V7.5Z" />
          </svg>
          Book Worm
        </Link>
        <span aria-hidden="true" className="h-4 w-px bg-line" />
        <nav aria-label="Primary" className="flex flex-1 flex-wrap">
          <NavLink to="/orders" className={navClass}>
            My Orders
          </NavLink>
          <NavLink to="/wishlist" className={navClass}>
            My Wishlist
          </NavLink>
          <NavLink to="/writers" className={navClass}>
            My Writers
          </NavLink>
        </nav>
        <Link
          to="/checkout"
          aria-label={`Shopping cart, ${count} item${count === 1 ? '' : 's'}`}
          className="relative p-2 text-muted hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth="1.6"
          >
            <path d="M3 4h2.5l2.2 10.5h10.1L20 7H6.4M9 19.5a1 1 0 1 0 0 .01M17 19.5a1 1 0 1 0 0 .01" />
          </svg>
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {count}
            </span>
          )}
        </Link>
        <span className="p-2 text-muted" aria-label="Account">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.5 18.5c1.5-2.5 3.2-3.5 5.5-3.5s4 1 5.5 3.5" />
          </svg>
        </span>
      </div>
    </header>
  )
}
