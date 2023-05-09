// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Dan DiGangi | Engineering Manager, Tech Mentor";
export const SITE_DESCRIPTION =
  "Dan DiGangi is a Chicago based software engineering manager, tech mentor, and the organizer of the React Loop conference.";
export const TWITTER_HANDLE = "@dandigangi";
export const MY_NAME = "Dan DiGangi";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
