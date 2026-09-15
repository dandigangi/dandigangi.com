/**
 * Uses aspect-ratio rather than a fixed pixel height: the iframe is full width,
 * so a hard 505px height only matched 16:9 at one viewport size and letterboxed
 * at every other.
 */
const Video = ({ url, title }) => {
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
      <iframe
        src={url}
        title={title}
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      ></iframe>
    </div>
  )
}

export default Video
