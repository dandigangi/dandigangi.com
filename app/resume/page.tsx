import { genPageMetadata } from 'app/seo'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Experience from '@/components/Resume'
import resumeXp from '@/data/resumeXp'
import Layout from 'app/layout'

export const metadata = genPageMetadata({ title: 'Resume' })

export default function Resume() {
  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-14">
          <div className="flex">
            <div className="basis-1/2">
              <h1 className="mb-6 text-5xl font-bold leading-none tracking-tight">Dan DiGangi</h1>
              <h2 className="mb-2 text-xl">Senior Software Engineering Manager, Tech Mentor</h2>
              <div className="text-sm opacity-80">
                Chicago, IL (Remote, Hybrid)&nbsp;&nbsp;&nbsp; |&nbsp; &nbsp; &nbsp;
                <a href="tel:6304144184">630-414-4184</a>
                &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;
                <a href="mailto:me@dandigangi.com">me@dandigangi.com</a>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="mb-3 italic text-lg text-right">Build experiences, not software</div>
              <div className="flex justify-end gap-3">
                <SocialIcon kind="web" href={siteMetadata.web} size={6} />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-2">
          <div>
            <h1 className="mb-6  font-bold leading-none tracking-tight text-gray-900 text-3xl dark:text-white">
              Experience
            </h1>
          </div>
          <div>
            {resumeXp.map((xp, key) => (
              <div key={key}>
                <Experience
                  key={key}
                  title={xp.jobTitle}
                  company={xp.company}
                  bullets={xp.bullets}
                  dates={xp.dates}
                  url={xp.url}
                />
              </div>
            ))}
          </div>

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="flex">
            {/* Education */}
            <div className="mb-10">
              <div className="mb-4 text-lg font-bold">Education</div>
              <div className="mb-1 font-bold">
                The Art Institutes - IL Institute of Art{' '}
                <span className="text-sm">
                  &nbsp;&nbsp;
                  <span className="font-normal opacity-50">|&nbsp;&nbsp;&nbsp;2007-2010</span>
                </span>
              </div>
              <div>Bachelor's Degree, Web Design & Interactive Media</div>
            </div>

            {/* Volunteering/Other */}
            <div>
              <div className="mb-1 font-bold">Volunteering/Other</div>
              <div>
                <ul>
                  <li>Some thing here</li>
                  <li>Some thing here</li>
                  <li>Some thing here</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Misc */}
          <div className="italic">
            <div className="mb-2">
              More information including additional software engineering positions available on{' '}
              <a
                target="_blank"
                href="https://linkedin.com/in/dandigangi"
                className="font-semibold underline"
              >
                LinkedIn
              </a>
            </div>
            References available upon request
          </div>
        </div>
      </div>
    </>
  )
}

Resume.getLayout = function getLayout(page) {
  console.log('page')
  return <div className="derp">{page}</div>
}
