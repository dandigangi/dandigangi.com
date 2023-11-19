import projects from '@/data/projects'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import PageHeader from '@/components/PageHeader'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PageHeader title="Projects" />
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projects.map(({ title, description, imgSrc, altText, href }) => (
              <Card
                key={title}
                title={title}
                description={description}
                imgSrc={imgSrc}
                alt={altText}
                href={href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
