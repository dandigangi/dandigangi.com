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
  const Component = getMDXComponent(code)
  return <Component components={{ ...defaultComponents, ...components }} />
}
