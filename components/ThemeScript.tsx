/**
 * Everything that has to be settled before first paint. Must stay inline in
 * <head>, and the storage key must stay in sync with ThemeToggle.
 *
 * `data-js` is set first and outside the try, so it lands even where storage
 * throws. It is what lets CSS tell the two cases apart without a flash:
 * anything that JS is about to take over can render its plain form in the
 * markup and be hidden here, before the browser has drawn either one.
 */
const script = `(function(){var d=document.documentElement;d.setAttribute('data-js','');try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.setAttribute('data-theme',t)}catch(e){d.setAttribute('data-theme','dark')}})()`

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
