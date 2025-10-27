import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { greet } from '../src/index'

describe('test-lib', () => {
  it('should greet correctly', () => {
    const result = Effect.runSync(greet('World'))
    expect(result).toBe('Hello, World! Welcome to test-lib.')
  })

  it('should handle Effect execution', () => {
    expect(() => Effect.runSync(greet('Test'))).not.toThrow()
  })


})
