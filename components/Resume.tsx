interface ExperienceProps {
  title?: string
  company: string
  descriptions?: string[]
  positions?: Array<{ jobTitle: string; dates: string; descriptions: string[] }>
  dates?: string
  url?: string
}

export default function Experience({
  title,
  company,
  descriptions,
  positions,
  dates,
  url,
}: ExperienceProps) {
  if (positions && positions.length > 0) {
    return (
      <div className="mb-10">
        <div className="mb-2 font-bold text-xl">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
              {company}
            </a>
          ) : (
            company
          )}
        </div>
        {positions.map((pos, i) => (
          <div key={i} className="mb-6">
            <div className="text-sm opacity-50 mb-1">{pos.dates}</div>
            <div className="font-semibold mb-2">{pos.jobTitle}</div>
            {pos.descriptions?.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {pos.descriptions.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-10">
      <div className="mb-2 font-bold text-xl">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
            {company}
          </a>
        ) : (
          company
        )}
      </div>
      {dates && <div className="text-sm opacity-50 mb-1">{dates}</div>}
      {title && <div className="font-semibold mb-2">{title}</div>}
      {descriptions && descriptions.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {descriptions.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
