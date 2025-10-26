#!/usr/bin/env node

import { TUIError, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'
import { generateProject } from './commands/generate'
import { initProject } from './commands/init'
import { GenerateError, ValidateError } from './types'

/**
 * Main entry point for create-effect-agent CLI
 *
 * This is the single unified command that orchestrates the entire workflow:
 * 1. Display welcome message
 * 2. Run interactive initialization (collect project configuration)
 * 3. Generate the project based on collected configuration
 * 4. Display success message
 *
 * All I/O is handled through TUIHandler (Effect CLI + OpenTui integration)
 * No external CLI frameworks - pure Effect programs only
 */
const main: Effect.Effect<void, ValidateError | GenerateError | TUIError> = Effect.gen(function* (_) {
    const tui = new TUIHandler()

    // Display welcome
    yield* _(
        tui.display('🚀 Welcome to create-effect-agent!', 'info')
    )
    yield* _(
        tui.display(
            'Bootstrap Effect-TS agentic projects with IDE rules and agent guidance',
            'info'
        )
    )

    // Collect configuration interactively
    const config = yield* _(initProject)

    // Generate project
    const project = yield* _(generateProject(config))

    // Display success
    yield* _(
        tui.display(
            `✓ Project created at ${project.path}`,
            'success'
        )
    )
    yield* _(
        tui.display(
            'Run `cd ' + project.path + ' && npm start` to get started!',
            'info'
        )
    )
})

// Execute the main program
Effect.runPromise(main).catch((err) => {
    console.error('✗ Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
})
