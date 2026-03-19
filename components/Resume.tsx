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
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <div className="font-medium">{pos.jobTitle}</div>
              <span className="text-sm font-normal opacity-50">|</span>
              <div className="text-sm font-normal opacity-50">{pos.dates}</div>
            </div>
            {pos.descriptions?.length > 0 && (
              <ul className="list-none space-y-2 mt-4 text-[18px] leading-[30px] text-[#cecdd0]">
                {pos.descriptions.map((d, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden="true" className="shrink-0 mt-[2px]">
                      ▸
                    </span>
                    <span>{d}</span>
                  </li>
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
      <div className="mb-2 font-bold text-xl flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
            {company}
          </a>
        ) : (
          company
        )}
        {title && <span className="font-medium">- {title}</span>}
        {dates && (
          <>
            <span className="text-sm font-normal opacity-50">|</span>
            <span className="text-sm font-normal opacity-50">{dates}</span>
          </>
        )}
      </div>
      {descriptions && descriptions.length > 0 && (
        <ul className="list-none space-y-2 mt-4 text-[18px] leading-[30px] text-[#cecdd0]">
          {descriptions.map((d, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="shrink-0 mt-[2px]">
                ▸
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
