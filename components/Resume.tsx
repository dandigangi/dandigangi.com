export default function Experience({ positions, descriptions, company, dates, title, url }) {
  return (
    <div className="experience mb-10">
      <div>
        <h2 className="mb-0 leading-none tracking-tight text-gray-900 dark:text-white">
          <div className="text-xl">
            <div className="mb-6">
              <a className=" text-xl font-bold underline" target="_blank" href={url}>
                {company}
              </a>
              &nbsp;&nbsp;
              {dates && (
                <>
                  -&nbsp;&nbsp;
                  <span>
                    <span className="opacity-80">{title}</span>
                    <span className="text-sm">
                      &nbsp;&nbsp;&nbsp;
                      <span className="opacity-60">|&nbsp;&nbsp;&nbsp;{dates}</span>
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </h2>
      </div>
      <div>{!positions ? SinglePosition(descriptions) : MultiplePositions(positions)}</div>
    </div>
  )
}

function SinglePosition(descriptions) {
  return (
    <ul className="list-outside md:list-disc ml-5 mb-14">
      {descriptions.map((desc, key) => {
        return (
          <li className="mb-3 opacity-80 text-lg leading-8" key={key}>
            {desc}
          </li>
        )
      })}
    </ul>
  )
}

function MultiplePositions(positions) {
  return (
    <div className="mb-14">
      {positions.map(({ jobTitle, dates, descriptions }, key) => {
        return (
          <div key={key}>
            <div className="mb-3">
              <span className="text-xl">{jobTitle}</span>
              <span className="text-sm">
                &nbsp;&nbsp;&nbsp;<span className="opacity-60">|&nbsp;&nbsp;&nbsp;{dates}</span>
              </span>
            </div>
            <ul className="list-outside md:list-disc ml-5 mb-9">
              {descriptions.map((desc, key) => {
                return (
                  <li className="mb-3 opacity-80 text-lg leading-8" key={key}>
                    <span key={key}>{desc}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
