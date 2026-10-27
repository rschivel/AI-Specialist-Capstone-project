# Book Worm – E-Bookstore Front End

React + Vite + TypeScript + Tailwind CSS application generated from the UI screenshots in the parent folder.

## Screens

| Route           | Screenshot                       | Purpose                                                              |
| --------------- | -------------------------------- | -------------------------------------------------------------------- |
| `/`             | 01 Landing / 02 Catalogue        | Category sidebar, search, filters, sort, Recommended/Bestsellers/New |
| `/books/:id`    | 03 Shopping cart (product page)  | Details, Add to Cart / Wishlist, writer, reviews, Related Reads      |
| `/checkout`     | 04 Payment & Purchase            | Cart lines, delivery address, coupon, gift points, grand total       |
| `/payment`      | 05 Payment Screen                | Credit card / Debit card / UPI / Wallet                              |
| `/confirmation` | 06 Confirmation on purchase      | Success message and purchased books                                  |
| `/orders`       | 02 (order history, Buy it again) | Past orders with "Buy it again"                                      |
| `/wishlist`     | Header nav                       | Saved books                                                          |
| `/writers`      | Header nav                       | Authors in the catalogue                                             |

## Getting started

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server (loopback)  |
| `npm run build`        | Typecheck and production build   |
| `npm run typecheck`    | TypeScript only                  |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier (write)                 |
| `npm run format:check` | Prettier (check)                 |
| `npm test`             | Vitest + React Testing Library   |

## Architecture

```
src/
  components/   ui/ (Button, Field, Feedback, StarRating), layout/, book/, catalogue/, payment/
  pages/        route-level screens (lazy loaded)
  services/     Axios client + service functions; UI never calls Axios directly
  store/        Zustand stores (cart, wishlist persisted; checkout in-memory only)
  schemas/      Zod schemas shared by forms and the API layer
  hooks/        useAsync, useDebouncedValue, useCartLines, useCheckoutSummary
  utils/        pure functions (pricing, filtering, formatting)
  data/         mock catalogue
```

### Backend integration

By default `src/services/mockAdapter.ts` answers API calls in the browser (orders and reviews are kept in
`localStorage`). To use a real backend, copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to an
`https://` URL. The service layer and UI need no changes. The endpoints the UI expects are:
`GET /books`, `GET /books/:id`, `GET /books/:id/related`, `GET|POST /books/:id/reviews`,
`GET|POST /orders`, `POST /coupons/validate`, `POST /payments`.

### Demo data

- Coupon code: `BOOKWORM100` (₹100 off).
- Test card: `4242 4242 4242 4242`, any name, CVV `123`, expiry in the future (e.g. `12/2099`).

### Security notes

- Card details are validated client-side and sent only to the payment service; they are never stored, logged or
  placed in global state. The CVV input is masked.
- Dev and preview servers bind to `127.0.0.1` only. A non-HTTPS `VITE_API_BASE_URL` is rejected (except localhost).
- All inputs are validated with Zod, and error messages shown to users are generic.
- In production, real card data must go through a PCI-compliant payment provider's hosted fields, not this form.
