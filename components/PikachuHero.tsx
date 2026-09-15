'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { heroActive, heroEverActive, justActivated, subscribe } from '@/lib/pikachu'
import styles from './PikachuHero.module.css'

/**
 * Replaces the abstract render once someone has met him. Gated on `ever` rather
 * than on `on`, so it is never downloaded by people who do not trigger it, but
 * stays mounted afterwards — an unmounted element cannot transition away.
 */
export default function PikachuHero({ objectPosition = '50% 34%' }: { objectPosition?: string }) {
  // The server snapshot is always false: the store only exists on the client.
  const ever = useSyncExternalStore(subscribe, heroEverActive, () => false)
  if (!ever) return null
  return <Layer objectPosition={objectPosition} />
}

function Layer({ objectPosition }: { objectPosition: string }) {
  const on = useSyncExternalStore(subscribe, heroActive, () => false)

  /**
   * This element mounts in two situations: the moment someone switches the hero
   * on, which should fade; and a client-side navigation to a page where it was
   * already on, which must not — starting at opacity 0 there flashes the
   * abstract render before fading in. Only the store can tell them apart.
   */
  const [fade] = useState(() => justActivated())
  const [painted, setPainted] = useState(() => !justActivated())

  useEffect(() => {
    if (!fade) return
    const frame = requestAnimationFrame(() => setPainted(true))
    return () => cancelAnimationFrame(frame)
  }, [fade])

  return (
    <Image
      src="/static/images/pikachu-hero.jpg"
      alt=""
      fill
      sizes="100vw"
      className={`${styles.layer} ${on && painted ? styles.on : ''}`}
      style={{ objectFit: 'cover', objectPosition }}
    />
  )
}
