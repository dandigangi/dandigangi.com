/**
 * Controlled vocabulary, not free text: the projects table sorts and groups on
 * this, so a sixth spelling of "Open Source" would quietly split a category.
 */
export type ProjectType = 'Website' | 'Resources' | 'Open source' | 'Conference'

export type Project = {
  /** Anchor target — the home page's cards deep-link to /projects#<slug>. */
  slug: string
  title: string
  description: string
  type: ProjectType
  year: number
  /** Absent when there is nothing to point at yet; that, not `status`, is what
   *  decides whether the row is a link. */
  url?: string
  /**
   * What the domain line shows. Derived from `url` for everything except React
   * Loop, where the live archive lives at a subdomain nobody should have to read.
   */
  domain?: string
  /** 'soon' adds a "Coming soon" badge beside the title. Independent of `url`:
   *  a project can be announced and still have a repo worth opening. */
  status: 'live' | 'soon'
  /** Also surfaced in the home page's projects column. */
  onHome?: boolean
}

/**
 * Authored order is the default order of the table, and the row numbers and the
 * colour cascade both derive from position — so moving an entry here moves its
 * number and its hue. Sorting in the UI renumbers accordingly, which is the
 * point: the number is the row's place in the current view, not an ID.
 */
export const projects: Project[] = [
  {
    slug: 'my-ai-stack',
    title: 'My AI Stack',
    description: 'Personal AI setup — agents, skills, and systems for my work.',
    type: 'Open source',
    year: 2026,
    url: 'https://github.com/dandigangi/ai',
    // Announced but not finished: the repo is there to look at, so the row is a
    // real link and the badge beside the title is what says it is not done.
    status: 'soon',
  },
  {
    slug: 'should-you-write-tests',
    title: 'Should You Write Tests?',
    description: 'If you ain’t writing tests, you ain’t shipping to prod.',
    type: 'Website',
    year: 2026,
    url: 'https://shouldyouwritetests.com',
    status: 'live',
  },
  {
    slug: 'engineering-manager-resources',
    title: 'Engineering Manager Resources',
    description:
      'A curated collection of leadership, management, and technical strategy resources.',
    type: 'Resources',
    year: 2024,
    url: 'https://github.com/dandigangi/engineering-manager-resources',
    status: 'live',
    onHome: true,
  },
  {
    slug: 'postmark-open-source',
    title: 'Postmark Open Source',
    description: 'OSS contributions to Postmark SDKs, integrations, and tooling.',
    type: 'Open source',
    year: 2024,
    // Points at his commits across the org rather than the org itself — the org
    // page says nothing about what he contributed.
    url: 'https://github.com/search?q=org%3AActiveCampaign+author%3Adandigangi&type=commits',
    domain: 'github.com — ActiveCampaign commits',
    status: 'live',
  },
  {
    slug: 'react-chicago',
    title: 'React Chicago Conference',
    description: 'The relaunch of Chicago’s only React conference.',
    type: 'Conference',
    year: 2025,
    url: 'https://reactchicago.com',
    status: 'live',
    onHome: true,
  },
  {
    slug: 'react-loop',
    title: 'React Loop Conference',
    description:
      'Chicago’s first and only React conference. Sold out, 250+ attendees, 12 speakers.',
    type: 'Conference',
    year: 2019,
    // Shown as reactloop.com; the archive at 2019. is what still resolves.
    url: 'https://2019.reactloop.com',
    domain: 'reactloop.com',
    status: 'live',
  },
  {
    slug: 'canvas-things',
    title: 'Canvas Things',
    description:
      'Took some time to learn Canvas & ThreeJS because it didn’t come up during my career.',
    type: 'Open source',
    year: 2026,
    url: 'https://github.com/dandigangi/canvas-things',
    status: 'live',
  },
]

/** "https://github.com/dandigangi/x" -> "github.com/dandigangi/x" */
export const projectDomain = (project: Project): string | null =>
  project.domain ?? project.url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') ?? null

/** The two the home page shows; the rest live only on /projects. */
export const homeProjects = projects.filter((project) => project.onHome)
