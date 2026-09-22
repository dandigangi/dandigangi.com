/**
 * Inline rather than the source .webp: it has to stay crisp while it scales
 * through the throw, and at this size the markup is smaller than the image
 * request it replaces.
 *
 * Drawn on a 100×100 box with the seam on the horizontal centre line, so
 * rotating it spins around the middle of the ball with no transform-origin
 * fiddling at the call site.
 */
export default function Orb({ size = 46 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Bottom half first, then the red cap over it — the seam is drawn last
          and covers both edges, which is what keeps it a single clean line. */}
      <circle cx="50" cy="50" r="46" fill="#f4f4f4" />
      <path d="M4 50a46 46 0 0 1 92 0Z" fill="#e8402f" />

      {/* The underside shadow the reference has, kept faint so it reads as form
          rather than as a second colour. */}
      <path
        d="M50 96a46 46 0 0 1-42.4-28.2A40 40 0 0 0 82 60.5 46 46 0 0 1 50 96Z"
        fill="#c9c9c9"
      />

      {/* Seam, then the outline. Both in the same near-black as the button ring. */}
      <path d="M4 50h92" stroke="#1c1c1c" strokeWidth="9" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#1c1c1c" strokeWidth="6" />

      {/* Centre button: dark collar, white ring, pale core. */}
      <circle cx="50" cy="50" r="17" fill="#3f3f3f" stroke="#1c1c1c" strokeWidth="5" />
      <circle cx="50" cy="50" r="10.5" fill="#fbfbfb" stroke="#1c1c1c" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="6.5" fill="none" stroke="#d0d0d0" strokeWidth="1.6" />

      {/* Specular highlight, top left, matching the reference. */}
      <ellipse
        cx="29"
        cy="24"
        rx="12"
        ry="9"
        fill="#fff"
        opacity="0.92"
        transform="rotate(-24 29 24)"
      />
    </svg>
  )
}
