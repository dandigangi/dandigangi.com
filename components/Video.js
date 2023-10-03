// Technically you can't use percentages vs explicit vals on iframes
const Video = ({ src, videoType, url }) => {
  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <iframe
        width="100%"
        height="505"
        src={url}
        title="Some unique title"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default Video
