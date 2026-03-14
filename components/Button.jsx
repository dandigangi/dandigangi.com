'use client'

export default function Button(props) {
  const { href, text, 'aria-label': ariaLabel } = props
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-white mt-8 bg-violet-800 hover:bg-violet-900 px-4 py-2 rounded-md text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
      aria-label={ariaLabel || (typeof text === 'string' ? text : 'Open link')}
    >
      {text}
    </a>
  )
}
