/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Dan DiGangi - Software Engineering Manager, Tech Instructor/Mentor',
  author: 'Dan DiGangi',
  headerTitle: false,
  description:
    'Senior software engineering manager and tech mentor building diverse, high performance teams delivering the best software and experiences.',
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
