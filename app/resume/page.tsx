import { genPageMetadata } from 'app/seo'
import SocialIcon from '@/components/social-icons'
import siteMetadata, { email } from '@/data/siteMetadata'
import Experience from '@/components/Resume'
import Button from '@/components/Button'
import resumeXp from '@/data/resume'

export const metadata = genPageMetadata({
  title: 'Resume',
  description: "Download Dan DiGangi's 2024 engineering management and software engineer resume.",
})

export default function Resume() {
  return (
    <>
      <div>
        {/* Header */}
        <div className="pt-8 mb-14">
          <div className="flex">
            <div className="basis-1/2">
              <h1 className="mb-4 text-5xl font-bold leading-none tracking-tight">Dan DiGangi</h1>
              <h2 className="mb-2 text-xl">Software Engineering Manager</h2>
              <div className="opacity-80">
                Chicago, IL&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                  da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
                </a>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="mb-3 italic text-lg text-right">
                <em>build experiences, not software</em>
              </div>
              <div className="flex justify-end gap-3">
                {/* <SocialIcon kind="web" href={siteMetadata.web} size={7} /> */}
                <SocialIcon kind="mail" href={`mailto:${email}`} size={6} />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div
          className="flex items-center p-4 mb-12 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            Complete work history and additional information available on{' '}
            <a
              target="_blank"
              href="https://linkedin.com/in/dandigangi"
              className="font-semibold underline hover:no-underline"
            >
              LinkedIn
            </a>
            .
            <br />
            <span className="text-white font-normal">
              8+ years managing software engineering teams and 20+ years software engineering.
            </span>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-2">
          <div>
            <h1 className="mb-8 font-light leading-none tracking-tight text-gray-900 text-4xl dark:text-white">
              Experience
            </h1>
          </div>
          <div>
            {/* TODO: This was so poorly done, cringe, data model needs to be fixed too */}
            {resumeXp.map(({ jobTitle, company, descriptions, positions, dates, url }, key) => (
              <div key={key}>
                <Experience
                  title={jobTitle}
                  company={company}
                  descriptions={descriptions}
                  positions={positions}
                  dates={dates}
                  url={url}
                />
              </div>
            ))}
          </div>

          <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="flex gap-16 mb-16">
            {/* Education */}
            <div className="mb-10 text-xl">
              <div className="mb-7 text-2xl font-light">Education</div>
              <div className="mb-2 font-bold">
                The Art Institutes - IL Institute of Art{' '}
                <span className="text-sm">
                  &nbsp;&nbsp;
                  <span className="font-normal opacity-50">|&nbsp;&nbsp;&nbsp;2007-2010</span>
                </span>
              </div>
              <div>Bachelor's Degree, Web Design & Interactive Media</div>
            </div>

            {/* Volunteering/Other */}
            <div className="md:pl-12">
              <div className="font-light text-2xl mb-7">Other</div>
              <div>
                <ul>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="https://2019.reactloop.com"
                    >
                      React Loop
                    </a>{' '}
                    Conference Organizer
                  </li>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="https://chicagojs.org"
                    >
                      Chicago JS Camp
                    </a>{' '}
                    Volunteer Staff
                  </li>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="https://platohq.com"
                    >
                      Plato
                    </a>
                    ,{' '}
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="https://mentorcruise.com"
                    >
                      MentorCruise
                    </a>
                    , and Private Mentoring
                  </li>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="/blog"
                    >
                      Technical Leadership Content Creator
                    </a>
                  </li>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
                      className="font-semibold underline"
                      target="_blank"
                      href="https://www.uprighted.com"
                    >
                      Upright Education
                    </a>{' '}
                    Software Instructor
                  </li>
                  <li className="mb-2 text-lg">
                    <a
                      rel="noopener"
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
          <div className="pt-5 pb-6 text-center">
            <div className="mb-2">
              Complete work history and additional information available on{' '}
              <a
                target="_blank"
                href="https://linkedin.com/in/dandigangi"
                className="font-semibold underline"
              >
                LinkedIn
              </a>
              .
              <br />
              <Button
                text={'Download Resume'}
                href={
                  'https://drive.google.com/file/d/11-rvQ2_RwaGHVLORNI5Vv-A4f8Llyy0s/view?usp=sharing'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
