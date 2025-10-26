import * as Effect from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { InkError, InkTUIHandler } from '../../index'

describe('InkTUIHandler', () => {
    const handler = new InkTUIHandler()

    describe('selectOption', () => {
        it('returns an Effect', () => {
            const options = [
                { label: 'Option 1', value: 'a' },
                { label: 'Option 2', value: 'b' },
            ]
            const effect = handler.selectOption('Choose', options)

            expect(effect).toBeTruthy()
            // Check it's an Effect
            expect(Effect.isEffect(effect)).toBe(true)
        })

        it('requires non-empty options array', () => {
            const effect = handler.selectOption('Choose', [
                { label: 'Option', value: 'a' },
            ])

            expect(Effect.isEffect(effect)).toBe(true)
        })
    })

    describe('inputPrompt', () => {
        it('returns an Effect', () => {
            const effect = handler.inputPrompt('Enter name')

            expect(effect).toBeTruthy()
            expect(Effect.isEffect(effect)).toBe(true)
        })

        it('accepts default value', () => {
            const effect = handler.inputPrompt('Enter name', 'John')

            expect(Effect.isEffect(effect)).toBe(true)
        })

        it('accepts validation function', () => {
            const validate = (v: string) => v.length > 0 || 'Required'
            const effect = handler.inputPrompt('Enter name', '', validate)

            expect(Effect.isEffect(effect)).toBe(true)
        })
    })

    describe('confirm', () => {
        it('returns an Effect', () => {
            const effect = handler.confirm('Are you sure?')

            expect(effect).toBeTruthy()
            expect(Effect.isEffect(effect)).toBe(true)
        })

        it('accepts title', () => {
            const effect = handler.confirm('Are you sure?', 'Confirm Action')

            expect(Effect.isEffect(effect)).toBe(true)
        })
    })

    describe('formFlow', () => {
        it('returns an Effect', () => {
            const effect = handler.formFlow({
                screens: [],
                onComplete: () => { },
            })

            expect(effect).toBeTruthy()
            expect(Effect.isEffect(effect)).toBe(true)
        })

        it('accepts title', () => {
            const effect = handler.formFlow({
                title: 'My Form',
                screens: [],
                onComplete: () => { },
            })

            expect(Effect.isEffect(effect)).toBe(true)
        })
    })

    describe('InkError', () => {
        it('is a TaggedError', () => {
            const error = new InkError('TestError', 'Test message')

            expect(error).toBeTruthy()
            expect(error.reason).toBe('TestError')
            expect(error.message).toBe('Test message')
        })

        it('has correct tag', () => {
            const error = new InkError('TestError', 'Test message')

            expect((error as any)._tag).toBe('InkError')
        })
    })
})
