'use client'

import { useRouter } from 'next/navigation'

/**
 * "Go back" on the 404, which is the one page where the thing you actually want
 * is almost always the page you just left.
 *
 * Falls through to home when there is nowhere to go back to — arriving here from
 * a bad link or a bookmark leaves no history entry, and a back button that does
 * nothing on the page that already told you it could not find anything is a
 * second dead end.
 */
export default function GoBack() {
  const router = useRouter()

  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push('/')
      }}
    >
      Go Back
    </button>
  )
}
