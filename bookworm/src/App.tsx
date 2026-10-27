import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Spinner } from './components/ui/Feedback'

const CataloguePage = lazy(() => import('./pages/CataloguePage'))
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const WritersPage = lazy(() => import('./pages/WritersPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CataloguePage />} />
          <Route path="books/:bookId" element={<BookDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="writers" element={<WritersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
