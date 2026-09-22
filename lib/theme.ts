/**
 * The storage key ThemeScript reads before first paint. Anything that writes a
 * theme has to use this exact string, or the choice is lost on reload.
 */
export const THEME_KEY = 'theme'

/**
 * Flips the document between the two themes and remembers it. No React state:
 * the attribute on <html> is the single source of truth, resolved by
 * ThemeScript before paint, so reading it back is always correct and can never
 * disagree with what is on screen.
 */
export function toggleTheme(): 'light' | 'dark' {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
  root.setAttribute('data-theme', next)
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Private browsing or blocked storage — the toggle still works for this page view.
  }
  return next
}
