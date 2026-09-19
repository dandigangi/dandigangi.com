import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MDXContent from './MDXContent'

/**
 * The shape velite emits, reduced to the part that matters: a component pulled
 * out of a spread of `props.components`, and a guard that throws if it is not
 * there. Written by hand so the test still means something if no real post
 * happens to reference a missing component.
 */
const compiled = (name: string) => `
  const {jsx: _jsx} = arguments[0];
  function _missing(id, component) {
    throw new Error("Expected component \`" + id + "\` to be defined")
  }
  function _createMdxContent(props) {
    const _components = {...props.components}, {${name}: _C} = _components;
    return _C || _missing("${name}", !0), _jsx(_C, {})
  }
  return {default: function (props) { return _createMdxContent(props) }}
`

describe('MDXContent', () => {
  it('renders a component the site supplies', () => {
    render(<MDXContent code={compiled('Spacer')} />)
    // Spacer renders an nbsp div — no throw is the assertion that matters.
    expect(document.body.textContent).not.toContain('failed to load')
  })

  it('falls back instead of throwing when a component is gone', () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<MDXContent code={compiled('RemovedEmbed')} />)).not.toThrow()
    expect(screen.getByRole('note')).toHaveTextContent('This embed failed to load.')
    // Names the missing component, so the log says which post to go and fix.
    expect(logged).toHaveBeenCalledWith(expect.stringContaining('RemovedEmbed'))

    logged.mockRestore()
  })

  it('renders nothing for a post with no body', () => {
    const { container } = render(<MDXContent code="   " />)
    expect(container).toBeEmptyDOMElement()
  })
})
