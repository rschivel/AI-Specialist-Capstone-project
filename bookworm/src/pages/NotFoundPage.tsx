import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-xl text-ink">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-link underline">
        Back to the catalogue
      </Link>
    </div>
  )
}
