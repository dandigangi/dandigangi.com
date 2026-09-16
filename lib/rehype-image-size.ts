import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { imageSize } from 'image-size'
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

/**
 * Stamps every local markdown image with its real pixel dimensions at build
 * time, so `next/image` can take over from a plain `<img>`.
 *
 * `next/image` refuses to render without width and height — that is the whole
 * point of it, since the pair is what reserves the space and stops the page
 * jumping as each image arrives. Markdown has nowhere to put them, so they are
 * read off the files here instead of being written into 85 posts by hand.
 *
 * Remote images are skipped: there is no file to measure, and the component
 * falls back to a plain <img> for anything without dimensions.
 */
export default function rehypeImageSize({ root = 'public' }: { root?: string } = {}) {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return

      const src = node.properties?.src
      if (typeof src !== 'string' || !src.startsWith('/')) return
      if (node.properties?.width || node.properties?.height) return

      try {
        const { width, height } = imageSize(readFileSync(join(process.cwd(), root, src)))
        if (!width || !height) return
        node.properties.width = width
        node.properties.height = height
      } catch {
        // Unreadable or not an image the library knows. Leaving the dimensions
        // off is what makes the component fall back to a plain <img>, which is
        // exactly the behaviour these had before.
      }
    })
  }
}
