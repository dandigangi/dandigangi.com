/** Vertical breathing room a post asks for explicitly, in pixels. */
export default function Spacer({ height = 1 }: { height?: number }) {
  if (!height) return null
  return <div style={{ height: `${height}px`, fontSize: '1px' }}>&nbsp;</div>
}
