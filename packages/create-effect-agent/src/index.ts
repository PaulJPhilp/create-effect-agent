#!/usr/bin/env node

import * as Effect from 'effect/Effect'
import { generateMinimalLib } from './commands/generate-minimal-lib.js'
import { GenerateError, ValidateError, GenerateConfig, FileError } from './types.js'

/**
 * Parse command line arguments
 */
const parseArgs = (args: string[]): { command: string; config: GenerateConfig | null } => {
    const [command, path, ...flags] = args

    if (command === 'generate' && path) {
        const config: GenerateConfig = {
            path,
            yes: false,
            noGit: false
        }

        for (let i = 0; i < flags.length; i++) {
            const flag = flags[i]
            if (flag === '--name' && flags[i + 1]) {
                config.name = flags[i + 1]
                i++
            } else if (flag === '--yes') {
                config.yes = true
            } else if (flag === '--no-git') {
                config.noGit = true
            }
        }

        return { command: 'generate', config }
    }

    return { command: 'init', config: null }
}

/**
 * Main entry point for create-effect-agent CLI
 *
 * Supports two modes:
 * 1. Interactive init (legacy): `create-effect-agent` - runs init then generate
 * 2. Direct generate: `create-effect-agent generate <path> [--name <name>] [--yes] [--no-git]`
 *
 * All I/O is handled through TUIHandler (Effect CLI + OpenTui integration)
 * No external CLI frameworks - pure Effect programs only
 */
const main = Effect.gen(function* (_) {
    // Parse command line arguments (skip 'node' and script name)
    const { command, config } = parseArgs(process.argv.slice(2))

    if (command === 'generate' && config) {
        // Direct generate mode - no TUI needed for generate command
        console.log('🚀 Generating minimal Effect library...')

        // Generate minimal lib project
        const project = yield* _(generateMinimalLib(config))

        // Display success
        console.log(`✓ Minimal Effect library created at ${project.path}`)
        console.log('Run `cd ' + project.path + ' && pnpm install && pnpm build` to get started!')
    } else {
        // Legacy interactive init mode - use TUI for the full flow
        // Dynamically import to avoid ESM issues with generate command
        const { initProject, generateProject } = yield* _(Effect.tryPromise(() =>
            import('./commands/init.js').then(async (initMod) => {
                const generateMod = await import('./commands/generate.js')
                return {
                    initProject: initMod.initProject,
                    generateProject: generateMod.generateProject
                }
            })
        ))

        // Collect configuration interactively
        const initConfig = yield* _(initProject)

        // Generate project
        const project = yield* _(generateProject(initConfig))

        // Display success with console.log since generate already logged
        console.log(`✓ Project created at ${project.path}`)
        console.log('Run `cd ' + project.path + ' && npm start` to get started!')
    }
})

// Execute the main program
Effect.runPromise(main).catch((err) => {
    console.error('✗ Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
})
