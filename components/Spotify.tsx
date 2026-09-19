/**
 * Shared shell for inline non-image embeds, per the design handoff: full
 * content-column width, #0A0A0C fill, 1px hairline, no radius.
 *
 * 152px is Spotify's compact player. At the old 352px the player rendered at
 * its natural height and left a large dead area below it.
 */
export default function Spotify({ src, title }: { src: string; title?: string }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#0A0A0C',
        border: '1px solid var(--line)',
      }}
    >
      {/* Defaulted for the same reason as Video's — see the note there. */}
      <iframe
        allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture"
        height="152"
        loading="lazy"
        src={src}
        title={title ?? 'Spotify player'}
        width="100%"
        style={{ display: 'block', border: 0 }}
      />
    </div>
  )
}
