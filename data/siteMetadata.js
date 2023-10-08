/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Dan DiGangi - Senior Software Engineering Manager & Technical Mentor',
  author: 'Dan DiGangi',
  headerTitle: false,
  description:
    'Senior software engineering manager and technical mentor focused on building diverse, high performance teams. Located in Chicago, IL and searching for new remote/hybrid career opportunities.',
  language: 'en-us',
  theme: 'dark',
  siteUrl: 'https://dandigangi.com',
  siteRepo: 'https://github.com/dandigangi/dandigangi.com',
  siteLogo: '/static/images/dan-digangi-logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'dandigangi@proton.me',
  linkedin: 'https://www.linkedin.com/in/dandigangi',
  twitter: 'https://twitter.com/dandigangi',
  github: 'https://github.com/dandigangi',
  web: 'https://dandigangi.com',
  locale: 'en-US',
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_ANALYTICS_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: false,
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: 'search.json',
    },
  },
}

module.exports = siteMetadata
