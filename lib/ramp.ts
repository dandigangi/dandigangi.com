/**
 * The projects table's colour cascade: red → violet, spread across however many
 * rows exist rather than six hardcoded stops.
 *
 * The six values below are the designed stops, and their hues are deliberately
 * uneven — 7°, 31°, 48°, 93°, 183°, 266° — weighted toward the warm end. A plain
 * linear sweep from red to violet produces a visibly different ramp (it lands on
 * yellow-green where the design has orange), so the generator interpolates
 * *between the designed stops* instead. At six rows it reproduces them exactly;
 * at any other count it stays on the same path.
 */
const DARK_STOPS = ['#FF6B5A', '#FFA23A', '#F2D14B', '#8BE04A', '#3ED8E0', '#B07BFF'] as const

/**
 * The same path, darkened for a light ground. The dark stops are 1.2–2:1 on
 * #EDEDEB — the yellow is effectively invisible — so light mode needs its own
 * set rather than an opacity adjustment. Each of these clears ~4.5:1.
 */
const LIGHT_STOPS = ['#C0392B', '#9A4A00', '#6F5200', '#2F6B12', '#0F6E75', '#6D3FD4'] as const

const toRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

function sample(stops: readonly string[], t: number): string {
  const clamped = Math.min(Math.max(t, 0), 1)
  const scaled = clamped * (stops.length - 1)
  const lower = Math.floor(scaled)
  const upper = Math.min(lower + 1, stops.length - 1)
  const mix = scaled - lower

  // An exact hit returns the designed value untouched rather than a rounded
  // interpolation of it, which is what keeps six rows pixel-identical to the spec.
  if (mix === 0) return stops[lower].toUpperCase()

  const a = toRgb(stops[lower])
  const b = toRgb(stops[upper])
  return toHex(a.map((channel, i) => channel + (b[i] - channel) * mix))
}

/** The dark-theme hue for row `index` of `count`. */
export const rowHue = (index: number, count: number): string =>
  sample(DARK_STOPS, count <= 1 ? 0 : index / (count - 1))

/** The light-theme hue for row `index` of `count`. */
export const rowHueLight = (index: number, count: number): string =>
  sample(LIGHT_STOPS, count <= 1 ? 0 : index / (count - 1))

/**
 * The menu sheet reuses the ramp from orange onward — the first link sits under
 * the "Menu" label rather than at the top of the page, and starting on red made
 * it read as an error state.
 */
export const menuHue = (index: number, count: number): string =>
  sample(DARK_STOPS, count <= 1 ? 0.2 : 0.2 + (0.8 * index) / (count - 1))
