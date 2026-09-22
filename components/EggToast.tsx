'use client'

import { useCallback, useState } from 'react'
import Toast from './Toast'

/**
 * The acknowledgement for the smaller eggs around the site — typing his name
 * into the blog search, guessing the password on the fake admin page.
 *
 * Once dismissed it stays dismissed for the life of this mount, so retyping the
 * trigger does not fire it again. Finding a thing twice is not finding it twice.
 */
export default function EggToast({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(false)
  // Stable, because Toast restarts its own dismiss timer whenever this changes.
  const close = useCallback(() => setDismissed(true), [])

  if (!show || dismissed) return null
  return <Toast variant="egg" onClose={close} />
}
