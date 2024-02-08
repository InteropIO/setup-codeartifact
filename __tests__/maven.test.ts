/**
 * Unit tests for src/maven.ts
 */
import { maven } from '../src/maven'
import { expect } from '@jest/globals'

describe('maven.ts', () => {
  it('throws an invalid number', async () => {
    const input = parseInt('foo', 10)
    expect(isNaN(input)).toBe(true)

    await expect(maven(input)).rejects.toThrow('milliseconds not a number')
  })

  it('waits with a valid number', async () => {
    const start = new Date()
    await maven(500)
    const end = new Date()

    const delta = Math.abs(end.getTime() - start.getTime())

    expect(delta).toBeGreaterThan(450)
  })
})
