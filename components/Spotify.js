// Technically you can't use percentages vs explicit vals on iframes
const Spotify = ({ src, videoType, url, title }) => {
  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <iframe
        allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture"
        frameBorder="0"
        height="352"
        loading="lazy"
        src={src}
        style={{
          borderRadius: 12,
        }}
        title={title}
        width="100%"
      ></iframe>
    </div>
  )
}

export default Spotify
