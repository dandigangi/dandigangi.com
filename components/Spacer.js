const Spacer = ({ height = 1 }) => {
  if (!height) return null
  return <div style={{ height: `${height}px`, fontSize: '1px' }}>&nbsp;</div>
}

export default Spacer
