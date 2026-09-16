/* eslint-disable react-hooks/static-components -- This is a server component: it
   renders once per request, so the component built from compiled MDX has no
   reconciliation identity to preserve. The rule targets remount churn in client
   components, which cannot occur here. */
import * as runtime from 'react/jsx-runtime'
import type { MDXComponents } from 'mdx/types'
import { components as defaultComponents } from './MDXComponents'

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
  return <Component components={{ ...defaultComponents, ...components }} />
}
