/* eslint-disable react-hooks/static-components -- This is a server component: it
   renders once per request, so the component built from compiled MDX has no
   reconciliation identity to preserve. The rule targets remount churn in client
   components, which cannot occur here. */
import * as runtime from 'react/jsx-runtime'
import type { MDXComponents } from 'mdx/types'
import { requiredComponents } from '@/lib/mdx'
import { components as defaultComponents } from './MDXComponents'
import MissingEmbed from './MissingEmbed'

/**
 * Velite compiles each MDX body to a function body that destructures the JSX
 * runtime from `arguments[0]` and returns `{ default: Component }`. The input is
 * our own build output, never user input.
 */
function getMDXComponent(code: string) {
  const fn = new Function(code)
  return fn(runtime).default as React.ComponentType<{ components?: MDXComponents }>
}

export default function MDXContent({
  code,
  components,
}: {
  code: string
  components?: MDXComponents
}) {
  /**
   * A post with no body compiles to an empty string, and `new Function('')`
   * returns undefined — so reading `.default` off it threw and took the whole
   * page down with a 500. A post that is only a title is a legitimate thing to
   * have on disk while it is being written, so it renders as nothing instead.
   */
  if (code.trim() === '') return null

  const Component = getMDXComponent(code)
  const merged: MDXComponents = { ...defaultComponents, ...components }

  /**
   * Anything the post asks for that nothing supplies would otherwise throw from
   * inside React and take the route down with it. Filling the gap here keeps
   * the failure the size of the embed.
   */
  for (const name of requiredComponents(code)) {
    if (name in merged) continue
    // Worth a line in the server log: the test below should have caught this,
    // so reaching it means a post shipped referencing something that is gone.
    console.error(`MDX: no component named "${name}" — rendering the fallback.`)
    merged[name] = () => <MissingEmbed name={name} />
  }

  return <Component components={merged} />
}
