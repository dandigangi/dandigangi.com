'use client'

export default function Button(props) {
  console.log(props)
  const handleClick = () => {
    window.open(props.href, '_blank')
  }

  return (
    <button
      onClick={() => handleClick()}
      className="mt-8 bg-violet-800 hover:bg-violet-900 px-4 py-2 rounded-md text-lg"
    >
      {props.text}
    </button>
  )
}
