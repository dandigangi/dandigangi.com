'use client'

import { useEffect, useRef } from 'react'
import styles from './Confetti.module.css'

const COLORS = [
  '#FFD23F', // Pikachu yellow
  '#FF4D6D',
  '#3DDC97',
  '#4CC9F0',
  '#B388FF',
  '#FF8C42',
  '#F5F4F1',
]

const COUNT = 140
const GRAVITY = 0.13
const DRAG = 0.992
const MAX_MS = 4200

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  rot: number
  vrot: number
  color: string
  /** Squash across the short axis, so pieces look like tumbling paper. */
  phase: number
  spin: number
}

/**
 * One burst, drawn on a canvas rather than as DOM nodes: 140 elements each
 * getting a transform every frame is the slow way to do this.
 */
export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const pieces: Piece[] = Array.from({ length: COUNT }, () => {
      // Outward from the middle, biased upward so everything arcs and falls.
      const angle = rand(0, Math.PI * 2)
      const speed = rand(4, 15)
      return {
        x: width / 2 + rand(-60, 60),
        y: height / 2 + rand(-40, 40),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(3, 9),
        w: rand(6, 12),
        h: rand(8, 16),
        rot: rand(0, Math.PI * 2),
        vrot: rand(-0.24, 0.24),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: rand(0, Math.PI * 2),
        spin: rand(0.08, 0.2),
      }
    })

    const started = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - started
      ctx.clearRect(0, 0, width, height)

      let alive = 0
      for (const p of pieces) {
        p.vx *= DRAG
        p.vy = p.vy * DRAG + GRAVITY
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        p.phase += p.spin

        if (p.y - p.h > height) continue
        alive++

        // Fade out over the last second rather than vanishing mid-air.
        ctx.globalAlpha = Math.max(0, Math.min(1, (MAX_MS - elapsed) / 900))
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.phase)))
        ctx.restore()
      }

      if (alive > 0 && elapsed < MAX_MS) {
        frame = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />
}
