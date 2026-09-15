import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts } from '@/lib/blog'
import { projects } from '@/data/projects'
import { resumeExperience } from '@/data/resume'

/**
 * llms.txt — a structured index for language models, generated from the same
 * content collection the site renders, so it cannot drift from what is published.
 * Convention: https://llmstxt.org
 */
export const dynamic = 'force-static'

export function GET() {
  const posts = getPublishedPosts()
  // Deliberately "most recently" rather than "currently": this is whatever role
  // sits at the top of the résumé, which is not necessarily an ongoing one.
  const latest = resumeExperience[0]

  const body = `# ${siteMetadata.author}

> ${siteMetadata.role} based in ${siteMetadata.location}. ${siteMetadata.description}

Most recently ${latest.title} at ${latest.company} (${latest.dates}). Engineering
leadership for 9+ years, software engineering for 20+. Tagline: "${siteMetadata.tagline}".
Open to senior engineering leadership roles.

Writing focuses on engineering management, hiring and interviewing, career
growth, developer platforms, and mental health in tech.

## Pages

- [About](${siteMetadata.siteUrl}/about): Background, experience, industries, coaching and volunteering.
- [Résumé](${siteMetadata.siteUrl}/resume): Full work history, education, and focus areas.
- [Projects](${siteMetadata.siteUrl}/projects): Open source and the Chicago React conference.
- [Blog](${siteMetadata.siteUrl}/blog): ${posts.length} posts on engineering leadership and career.
- [Contact](${siteMetadata.siteUrl}/contact): Email, LinkedIn, X, GitHub, and mentoring platforms.

## Projects

${projects.map((project) => `- [${project.title}](${project.url}): ${project.description}`).join('\n')}

## Writing

${posts.map((post) => `- [${post.title}](${siteMetadata.siteUrl}${post.permalink})${post.summary ? `: ${post.summary}` : ''}`).join('\n')}

## Contact

- Email: ${siteMetadata.email}
- LinkedIn: ${siteMetadata.linkedin}
- X: ${siteMetadata.twitter}
- GitHub: ${siteMetadata.github}
- RSS: ${siteMetadata.siteUrl}/feed.xml
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
