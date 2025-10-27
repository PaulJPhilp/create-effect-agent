import { spawn } from 'child_process'
import * as Effect from 'effect/Effect'
import { GitError } from '../types.js'

/**
 * Initialize a git repository
 */
export const gitInit = (cwd: string): Effect.Effect<void, GitError> =>
    Effect.async((resume) => {
        const child = spawn('git', ['init'], { cwd })

        child.on('close', (code) => {
            if (code === 0) {
                resume(Effect.succeed(undefined))
            } else {
                resume(
                    Effect.fail(
                        new GitError(`git init failed with exit code ${code}`)
                    )
                )
            }
        })

        child.on('error', (err) => {
            resume(
                Effect.fail(
                    new GitError(
                        `Failed to execute git init: ${err instanceof Error ? err.message : String(err)}`
                    )
                )
            )
        })
    })

/**
 * Stage all files
 */
export const gitAdd = (cwd: string): Effect.Effect<void, GitError> =>
    Effect.async((resume) => {
        const child = spawn('git', ['add', '.'], { cwd })

        child.on('close', (code) => {
            if (code === 0) {
                resume(Effect.succeed(undefined))
            } else {
                resume(
                    Effect.fail(
                        new GitError(`git add failed with exit code ${code}`)
                    )
                )
            }
        })

        child.on('error', (err) => {
            resume(
                Effect.fail(
                    new GitError(
                        `Failed to execute git add: ${err instanceof Error ? err.message : String(err)}`
                    )
                )
            )
        })
    })

/**
 * Create initial commit
 */
export const gitCommit = (
    cwd: string,
    message: string
): Effect.Effect<void, GitError> =>
    Effect.async((resume) => {
        const child = spawn('git', ['commit', '-m', message], { cwd })

        child.on('close', (code) => {
            if (code === 0) {
                resume(Effect.succeed(undefined))
            } else {
                resume(
                    Effect.fail(
                        new GitError(
                            `git commit failed with exit code ${code}`
                        )
                    )
                )
            }
        })

        child.on('error', (err) => {
            resume(
                Effect.fail(
                    new GitError(
                        `Failed to execute git commit: ${err instanceof Error ? err.message : String(err)}`
                    )
                )
            )
        })
    })
