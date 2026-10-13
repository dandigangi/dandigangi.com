'use client'

import NextImage from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from './Icons'
import styles from './AudioPlayer.module.css'

const SPEEDS = [1, 1.25, 1.5, 2]
const SKIP_SECONDS = 15

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

/**
 * An inline audio player for posts, with optional artwork above it. Same shell
 * as Video and Spotify: full column width, #0A0A0C fill, 1px hairline.
 *
 * `preload="metadata"` matters: the recordings are long, and anything more
 * eager downloads tens of megabytes for every reader who never presses play.
 */
export default function AudioPlayer({
  src,
  title,
  image,
  imageAlt,
  imageAspect = '16 / 9',
}: {
  src: string
  title?: string
  image?: string
  imageAlt?: string
  /** CSS aspect-ratio for the artwork box; the image is cropped to fill it. */
  imageAspect?: string
}) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)

  // The server-rendered <audio> starts fetching metadata before hydration, so
  // loadedmetadata can fire before React's listener exists and never again.
  useEffect(() => {
    const el = audio.current
    if (el && el.readyState >= 1) setDuration(el.duration)
  }, [])

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  const seek = (to: number) => {
    const el = audio.current
    if (!el) return
    el.currentTime = Math.min(Math.max(to, 0), duration || to)
    setCurrent(el.currentTime)
  }

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    if (audio.current) audio.current.playbackRate = next
    setSpeed(next)
  }

  const label = title ?? 'Audio'

  return (
    <figure className={styles.player} aria-label={label}>
      {image && (
        <div className={styles.art} style={{ aspectRatio: imageAspect }}>
          <NextImage
            src={image}
            alt={imageAlt ?? ''}
            fill
            sizes="(max-width: 780px) 100vw, 720px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.play}
          onClick={toggle}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className={styles.body}>
          {title && <figcaption className={styles.title}>{title}</figcaption>}
          <input
            type="range"
            className={styles.scrub}
            min={0}
            max={duration || 0}
            step={1}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            style={
              { '--fill': `${duration ? (current / duration) * 100 : 0}%` } as React.CSSProperties
            }
          />
          <div className={styles.meta}>
            <span>
              {formatTime(current)} / {formatTime(duration)}
            </span>
            <span className={styles.actions}>
              <button
                type="button"
                onClick={() => seek(current - SKIP_SECONDS)}
                aria-label={`Back ${SKIP_SECONDS} seconds`}
              >
                −{SKIP_SECONDS}
              </button>
              <button
                type="button"
                onClick={() => seek(current + SKIP_SECONDS)}
                aria-label={`Forward ${SKIP_SECONDS} seconds`}
              >
                +{SKIP_SECONDS}
              </button>
              <button type="button" onClick={cycleSpeed} aria-label={`Playback speed ${speed}x`}>
                {speed}×
              </button>
            </span>
          </div>
        </div>
      </div>

      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
      />
    </figure>
  )
}
