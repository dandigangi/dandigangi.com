import { genPageMetadata } from 'app/seo'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Experience from '@/components/Resume'
import { resumeOther, resumeXp } from '@/data/resume'

export const metadata = genPageMetadata({
  title: 'Resume',
  description: "Download Dan DiGangi's 2024 engineering management and software engineer resume.",
})

export default function Resume() {
  const downloadHref =
    'https://drive.google.com/file/d/1aMeWulQo0745ip7tWXLliIuuwJm_Ns3S/view?usp=sharing'

  return (
    <>
      <div>
        {/* Header */}
        <div className="pt-8 mb-14">
          <div className="flex flex-col gap-6 md:flex-row md:gap-0">
            <div className="md:basis-1/2">
              <h1 className="mb-4 text-5xl font-bold leading-none tracking-tight">Dan DiGangi</h1>
              <h2 className="mb-2 text-xl">Senior Software Engineering Manager</h2>
              <div className="opacity-80">
                Chicago, IL&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                  da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
                </a>
              </div>
            </div>
            <div className="md:basis-1/2 md:flex md:flex-col md:items-end">
              <div className="mb-3 italic text-lg text-left md:text-right text-[#cecdd0]">
                <em>build experiences, not software</em>
              </div>
              <div className="flex justify-start md:justify-end gap-3">
                {/* <SocialIcon kind="web" href={siteMetadata.web} size={7} /> */}
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-2">
          <div className="mb-8">
            <div className="bg-gray-50 dark:bg-gray-900/70 shadow-md py-2 dark:shadow-gray-800/40 rounded overflow-hidden">
              <div className="py-3 px-4 text-lg text-gray-700 dark:text-gray-300">
                For a complete work history and more information, check out{' '}
                <a
                  href="https://linkedin.com/in/dandigangi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  LinkedIn
                </a>
                .
              </div>
            </div>
          </div>
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

          <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16">
            {/* Education */}
            <div className="md:flex-1 text-xl">
              <div className="mb-7 text-2xl font-light">Education</div>
              <div className="mb-2 font-bold">
                The Art Institutes - IL Institute of Art{' '}
                <span className="text-sm">
                  &nbsp;&nbsp;
                  <span className="font-normal opacity-50">|&nbsp;&nbsp;&nbsp;2007-2010</span>
                </span>
              </div>
              <div className="text-[18px] text-[#cecdd0]">
                Bachelor's Degree, Web Design & Interactive Media
              </div>
            </div>

            {/* Volunteering/Other */}
            <div className="md:flex-1 md:pl-12">
              <div className="font-light text-2xl mb-7">Other</div>
              <div>
                <ul>
                  {resumeOther.map((item) => (
                    <li key={item} className="mb-2 text-lg font-normal text-[#cecdd0]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8 pb-8">
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white bg-violet-800 hover:bg-violet-900 px-7 py-3 rounded-md text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
