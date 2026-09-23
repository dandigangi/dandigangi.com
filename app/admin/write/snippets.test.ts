import { describe, expect, it } from 'vitest'
import { insertSnippet } from './snippets'

describe('insertSnippet', () => {
  it('puts the component on its own block and the caret in its first value', () => {
    const body = 'One.\n\nTwo.'
    const at = body.indexOf('\n\nTwo')
    const { body: next, caret } = insertSnippet(body, at, at, '<Invisible text="" />')
    expect(next).toBe('One.\n\n<Invisible text="" />\n\nTwo.')
    expect(next.slice(caret - 1, caret + 1)).toBe('""')
  })

  it('replaces a selection', () => {
    const body = 'keep DROP keep'
    const { body: next } = insertSnippet(body, 5, 9, '<Spacer height={24} />')
    expect(next).toBe('keep \n\n<Spacer height={24} />\n\n keep')
  })

  it('adds nothing around it in an empty body', () => {
    expect(insertSnippet('', 0, 0, '<Spacer height={24} />').body).toBe('<Spacer height={24} />')
  })
})
