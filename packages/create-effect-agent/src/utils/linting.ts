import { spawn } from 'child_process'
import * as Effect from 'effect/Effect'
import { LintingError } from '../types'

export interface UltraciteOptions {
    check?: boolean
    write?: boolean
}

/**
 * Run Ultracite for code formatting
 */
export const runUltracite = (
    cwd: string,
    options?: UltraciteOptions
): Effect.Effect<void, LintingError> =>
    Effect.async((resume) => {
        const args = ['ultracite']

        if (options?.check) {
            args.push('--check')
        }

        if (options?.write !== false) {
            // Default to write mode
        }

        const child = spawn('npx', args, { cwd, stdio: 'inherit' })

        child.on('close', (code) => {
            if (code === 0) {
                resume(Effect.succeed(undefined))
            } else {
                resume(
                    Effect.fail(
                        new LintingError(
                            `Ultracite failed with exit code ${code}`
                        )
                    )
                )
            }
        })

        child.on('error', (err) => {
            resume(
                Effect.fail(
                    new LintingError(
                        `Failed to execute Ultracite: ${err instanceof Error ? err.message : String(err)}`
                    )
                )
            )
        })
    })
