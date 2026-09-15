'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from './Icons'
import styles from './Portrait.module.css'

const REAL = '/static/images/dan-digangi-portrait.jpg'
const ALTER = '/static/images/dan-digangi-alter-ego.jpg'

/**
 * Both images are the same 400x400 crop, so swapping the src cannot shift the
 * layout around it.
 */
export default function Portrait() {
  const [alter, setAlter] = useState(false)

  return (
    <div className={styles.portrait}>
      <div className={styles.frame}>
        <Image
          src={alter ? ALTER : REAL}
          alt={alter ? 'Dan DiGangi, alter ego' : 'Dan DiGangi'}
          width={400}
          height={400}
          sizes="(max-width: 700px) 100vw, 320px"
          priority
        />
        <button
          type="button"
          onClick={() => setAlter((v) => !v)}
          className={styles.toggle}
          aria-pressed={alter}
        >
          Alter Ego <ArrowRight size={11} />
        </button>
      </div>
      <span className="meta">Dan DiGangi · Chicago</span>
    </div>
  )
}
