/**
 * Shared shell for inline non-image embeds, per the design handoff: full
 * content-column width, #0A0A0C fill, 1px hairline, no radius.
 *
 * 152px is Spotify's compact player. At the old 352px the player rendered at
 * its natural height and left a large dead area below it.
 */
const Spotify = ({ src, title }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#0A0A0C',
        border: '1px solid var(--line)',
      }}
    >
      <iframe
        allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture"
        frameBorder="0"
        height="152"
        loading="lazy"
        src={src}
        title={title}
        width="100%"
        style={{ display: 'block' }}
      ></iframe>
    </div>
  )
}

export default Spotify
