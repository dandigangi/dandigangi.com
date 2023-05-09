import { defineConfig } from "astro/config";
import { tokenColors } from "./custom-theme.json";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
 markdown: {
    drafts: true,
    shikiConfig: { theme: "css-variables" }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: 'https://lexingtonthemes.com',
  integrations: [preact(), tailwind(), compress(), sitemap()]
});