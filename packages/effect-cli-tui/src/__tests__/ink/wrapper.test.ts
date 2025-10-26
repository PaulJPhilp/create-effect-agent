import * as Effect from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { InkError } from '../../effects/ink-wrapper'

describe('InkError', () => {
    it('creates error with reason and message', () => {
        const error = new InkError('RenderError', 'Failed to render')

        expect(error.reason).toBe('RenderError')
        expect(error.message).toBe('Failed to render')
    })

    it('is serializable to string', () => {
        const error = new InkError('RenderError', 'Failed to render')

        expect(String(error)).toBeTruthy()
    })

    it('can be used in Effect.fail', () => {
        const error = new InkError('TestError', 'Test')
        const effect = Effect.fail(error)

        expect(Effect.isEffect(effect)).toBe(true)
    })
})
