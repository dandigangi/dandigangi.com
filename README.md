# dandigangi.com

My personal site: writing, projects, résumé, and a place to get in touch.

Second time around — the first version was Astro, this one is Next.js. Live at
[dandigangi.com](https://dandigangi.com).

## Stack

- **Next.js** (App Router, Turbopack) with **React** and **TypeScript**
- **Velite** compiles the MDX in `data/blog/` into a typed content collection at
  build time, so posts are data the app can query rather than files it has to go
  and read
- Plain **CSS Modules** and a handful of custom properties. No UI library and no
  utility framework — the design is specific enough that either would be a layer
  to fight rather than a head start
- **Vitest** + Testing Library for the parts worth testing

Nearly every route is statically generated. The only dynamic ones are under
`/admin`.

## Running it

```bash
yarn install
yarn dev          # http://127.0.0.1:3000
```

`yarn dev` compiles the content once before starting. If you are editing posts
and want them to reload as you type, run `yarn dev:content` alongside it.

```bash
yarn build        # content, then next build, then the post-build pass
yarn serve        # serve the build
yarn test         # vitest
yarn lint
```

## Layout

```
app/          routes; each page owns its own .module.css
components/   shared UI, all client/server split by directive
lib/          the logic worth testing on its own
data/blog/    the posts, as MDX
css/          globals and the design tokens everything reads
scripts/      build steps and one-off tooling
public/       images, fonts, and anything served as-is
```

## Writing a post

Posts are MDX with frontmatter, in `data/blog/`. The filename is the slug.

Two things keep a post out of the published list: `draft: true` in the
frontmatter, and a date in the future. The second is the one that gets used —
posts are written ahead of time and dated for when they should appear, and they
stay hidden until that day passes on their own.

There is an editor at `/admin/write` in development that handles the frontmatter
and the tag list for you, which is mostly what it is for — the tags have to
agree with the ones already in use or they fragment the index.

## A note on the code

Comments here explain _why_, not _what_. If something looks wrong at first
glance there is usually a comment saying which thing bit me and when. A few
of them are load-bearing enough that changing the line without reading the
comment will quietly break something — the CSS custom-property notes in
`css/globals.css` especially.

## Licence

Code is MIT (see `LICENSE`). The writing, images, and design are mine and are
not covered by it.
