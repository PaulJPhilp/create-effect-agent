import * as Effect from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { EffectCLI, TUIHandler } from '../index'

describe('effect-cli-tui Integration', () => {
    describe('TUIHandler - Display Messages', () => {
        const tui = new TUIHandler()

        it('should display success message', async () => {
            const consoleSpy = vi.spyOn(console, 'log')
            await Effect.runPromise(tui.display('Success!', 'success'))
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('✓')
            )
            consoleSpy.mockRestore()
        })

        it('should display error message', async () => {
            const consoleSpy = vi.spyOn(console, 'log')
            await Effect.runPromise(tui.display('Error!', 'error'))
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('✗')
            )
            consoleSpy.mockRestore()
        })

        it('should display info message', async () => {
            const consoleSpy = vi.spyOn(console, 'log')
            await Effect.runPromise(tui.display('Info', 'info'))
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('ℹ')
            )
            consoleSpy.mockRestore()
        })
    })

    describe('EffectCLI - Integration', () => {
        const cli = new EffectCLI()

        it('should be instantiable', () => {
            expect(cli).toBeDefined()
            expect(typeof cli.run).toBe('function')
            expect(typeof cli.stream).toBe('function')
        })

        it('should return Effect.Effect type', () => {
            const result = cli.run('--version', [])
            expect(result).toBeDefined()
        })
    })
})
