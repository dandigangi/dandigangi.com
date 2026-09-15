/**
 * Resolves the theme before first paint. Must stay inline in <head> and stay in
 * sync with the storage key used by ThemeToggle.
 */
const script = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
