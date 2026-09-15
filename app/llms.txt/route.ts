import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts } from '@/lib/blog'
import { resumeExperience } from '@/data/resume'

/**
 * llms.txt — a structured index for language models, generated from the same
 * content collection the site renders, so it cannot drift from what is published.
 * Convention: https://llmstxt.org
 */
export const dynamic = 'force-static'

export function GET() {
  const posts = getPublishedPosts()
  const current = resumeExperience[0]

  const body = `# ${siteMetadata.author}

> ${siteMetadata.role} based in ${siteMetadata.location}. ${siteMetadata.description}

Currently ${current.title} at ${current.company} (${current.dates}). Engineering
leadership for 7+ years, software engineering for 20+. Tagline: "${siteMetadata.tagline}".

Writing focuses on engineering management, hiring and interviewing, career
growth, developer platforms, and mental health in tech.

## Pages

- [About](${siteMetadata.siteUrl}/about): Background, experience, industries, coaching and volunteering.
- [Résumé](${siteMetadata.siteUrl}/resume): Full work history, education, and focus areas.
- [Blog](${siteMetadata.siteUrl}/blog): ${posts.length} posts on engineering leadership and career.
- [Contact](${siteMetadata.siteUrl}/contact): Email, LinkedIn, X, GitHub, and mentoring platforms.

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
