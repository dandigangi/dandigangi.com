import { genPageMetadata } from 'app/seo'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Experience from '@/components/Resume'
import resumeXp from '@/data/resumeXp'

export const metadata = genPageMetadata({ title: 'Resume' })

export default function Resume() {
  return (
    <>
      <div>
        {/* Header */}
        <div className="pt-8 mb-14">
          <div className="flex">
            <div className="basis-1/2">
              <h1 className="mb-6 text-5xl font-bold leading-none tracking-tight">Dan DiGangi</h1>
              <h2 className="mb-2 text-xl">Senior Software Engineering Manager, Tech Mentor</h2>
              <div className="opacity-80">
                Chicago, IL (Remote, Hybrid)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                  da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
                </a>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="mb-3 italic text-lg text-right">Build experiences, not software</div>
              <div className="flex justify-end gap-3">
                <SocialIcon kind="web" href={siteMetadata.web} size={7} />
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

          <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="flex gap-16 mb-16">
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
            <div className="pl-12">
              <div className="font-bold text-lg mb-4">Volunteering/Other</div>
              <div>
                <ul>
                  <li className="mb-1">
                    <a
                      className="font-semibold underline"
                      target="_blank"
                      href="https://2019.reactloop.com"
                    >
                      React Loop
                    </a>{' '}
                    Conference Organizer
                  </li>
                  <li className="mb-1">
                    <a
                      className="font-semibold underline"
                      target="_blank"
                      href="https://platohq.com"
                    >
                      Plato
                    </a>
                    ,{' '}
                    <a
                      className="font-semibold underline"
                      target="_blank"
                      href="https://mentorcruise.com"
                    >
                      MentorCruise
                    </a>
                    , and Private Mentoring
                  </li>
                  <li className="mb-1">
                    <a
                      className="font-semibold underline"
                      target="_blank"
                      href="https://chicagojs.org"
                    >
                      Chicago JS Camp
                    </a>{' '}
                    Staff
                  </li>
                  <li>
                    <a
                      className="font-semibold underline"
                      target="_blank"
                      href="https://www.startupinstitute.com/"
                    >
                      Startup Institute
                    </a>{' '}
                    Javascript Teacher
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Misc */}
          <div className="italic">
            <div className="mb-2">
              Detailed work history and additional information available on{' '}
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
