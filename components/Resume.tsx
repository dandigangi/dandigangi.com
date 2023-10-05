export default function Experience({ bullets, company, dates, title, url }) {
  return (
    <div className="experience mb-10">
      <div>
        <h2 className="mb-0 leading-none tracking-tight text-gray-900 dark:text-white">
          <div className="text-lg">
            <div className="mb-4">
              <a className="font-bold underline" target="_blank" href={url}>
                {company}
              </a>{' '}
              - <span className="opacity-80">{title}</span>
              <span className="text-sm">
                &nbsp;&nbsp;&nbsp;<span className="opacity-50">|&nbsp;&nbsp;&nbsp;{dates}</span>
              </span>
            </div>
          </div>
        </h2>
      </div>
      <div>
        <ul className="list-outside md:list-disc ml-5 mb-7">
          {bullets.map((bullet, key) => {
            return (
              <li className="mb-2 opacity-80" key={key}>
                {bullet}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
