import * as TUI from 'effect-cli-tui'
import * as Effect from 'effect/Effect'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { CLIConfig, GenerateConfig, GeneratedProject } from '../types.js'
import { GenerateError, ValidateError, FileError } from '../types.js'
import { createDirectory, pathExists, writeFile } from '../utils/file.js'
import { generateMinimalLib } from './generate-minimal-lib.js'
import { generateSupermemoryLib } from './generate-supermemory-lib.js'

/**
 * generateProject: Orchestrates the complete project generation workflow
 *
 * Steps:
 * 1. Validate project path doesn't exist
 * 2. Create directory structure
 * 3. Apply template files
 * 4. Copy IDE rules (optional)
 * 5. Copy agent rules (optional)
 * 6. Install ecosystem libraries (via pnpm)
 * 7. Initialize git repository (optional)
 * 8. Run Ultracite formatting (optional)
 * 9. Display success message
 *
 * Returns: GeneratedProject with metadata
 */
export const generateProject = (
    config: GenerateConfig
): Effect.Effect<GeneratedProject, GenerateError | ValidateError | FileError> =>
    Effect.gen(function* (_) {
        const tui = new TUI.TUIHandler()

        // Log start
        yield* _(
            tui.display(
                `Creating project at ${config.path}...`,
                'info'
            )
        )

        let selectedTemplate = config.template

        if (!selectedTemplate) {
            const templateChoice = yield* _(
                tui.prompt.select(
                    'Select a template:',
                    [
                        { label: 'Basic Effect Library', value: 'basic' },
                        { label: 'Supermemory Effect Library', value: 'supermemory' }
                    ]
                )
            )
            selectedTemplate = templateChoice.value
        }

        // Validate inputs
        if (!config.path) {
            return yield* _(Effect.fail(new ValidateError('Path is required')))
        }

        // Resolve and validate target path
        const targetPath = path.resolve(config.path)

        // Check if directory exists and is empty
        const exists = yield* _(pathExists(targetPath))
        if (exists) {
            // Check if it's a directory and empty
            const stat = yield* _(Effect.tryPromise({
                try: () => fs.stat(targetPath),
                catch: (err) => new FileError(`Failed to stat ${targetPath}: ${err}`)
            }))
            if (!stat.isDirectory()) {
                return yield* _(Effect.fail(new ValidateError(
                    `'${config.path}' exists and is not a directory.`
                )))
            }
            const entries = yield* _(Effect.tryPromise({
                try: () => fs.readdir(targetPath),
                catch: (err) => new FileError(`Failed to read directory ${targetPath}: ${err}`)
            }))
            if (entries.length > 0) {
                return yield* _(Effect.fail(new ValidateError(
                    `Directory '${config.path}' is not empty. Please choose an empty directory.`
                )))
            }
        }

        // Determine project name
        const projectName = config.name || path.basename(targetPath)

        // Validate project name (kebab-case)
        if (!/^[a-z][a-z0-9-]*$/.test(projectName)) {
            return yield* _(Effect.fail(new ValidateError(
                'Project name must be in kebab-case (lowercase letters, numbers, and hyphens only, starting with a letter)'
            )))
        }

        // Create directory if it doesn't exist
        yield* _(createDirectory(targetPath))

        let files: Record<string, string>

        switch (selectedTemplate) {
            case 'basic':
                files = yield* _(generateMinimalLib(config))
                break
            case 'supermemory':
                files = yield* _(generateSupermemoryLib(config))
                break
            default:
                return yield* _(Effect.fail(new GenerateError(`Unknown template: ${selectedTemplate}`, 'template')))
        }

        // Write files
        for (const filePath in files) {
            const content = files[filePath]
            const absolutePath = path.join(targetPath, filePath)
            yield* _(writeFile(absolutePath, content))
        }

        // Initialize git if requested (non-critical operation)
        if (!config.noGit) {
            // Run git init asynchronously, don't wait for it
            import('child_process').then(({ execSync }) => {
                try {
                    execSync('git init', { cwd: targetPath, stdio: 'pipe' })
                    execSync('git add .', { cwd: targetPath, stdio: 'pipe' })
                    execSync('git commit -m "Initial commit"', { cwd: targetPath, stdio: 'pipe' })
                    console.log('✓ Git repository initialized')
                } catch (error) {
                    console.log('⚠️  Git initialization failed (git may not be available)')
                }
            }).catch(() => {
                console.log('⚠️  Git initialization failed (git may not be available)')
            })
        }

        yield* _(
            tui.display(
                `Project created at ${targetPath}`,
                'success'
            )
        )

        return {
            name: projectName,
            path: targetPath,
            config: {
                projectName,
                projectPath: targetPath,
                template: selectedTemplate as any,
                agents: [],
                libraries: [],
                ideRules: [],
                setupLinting: false,
                setupGit: !config.noGit
            },
            generatedAt: new Date()
        }
    })
