import { Link } from 'react-router-dom'

export function TagLinks({ tags }: { tags: string[] }) {
  return (
    <p className="text-xs">
      {tags.map((tag, i) => (
        <span key={tag}>
          <Link
            to={`/?tag=${encodeURIComponent(tag)}`}
            className="text-link underline hover:text-white"
          >
            {tag}
          </Link>
          {i < tags.length - 1 && ', '}
        </span>
      ))}
    </p>
  )
}
