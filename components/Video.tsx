/**
 * Uses aspect-ratio rather than a fixed pixel height: the iframe is full width,
 * so a hard 505px height only matched 16:9 at one viewport size and letterboxed
 * at every other.
 */
export default function Video({ url, title }: { url: string; title?: string }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '16 / 9',
        background: '#0A0A0C',
        border: '1px solid var(--line)',
      }}
    >
      {/*
       * Defaulted rather than required: an unnamed frame is a serious axe
       * violation, and posts written before this prop existed do not pass one.
       * A generic name beats no name; a specific one is still better, so pass
       * `title` from the post where it is worth it.
       */}
      <iframe
        src={url}
        title={title ?? 'Embedded video'}
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </div>
  )
}
