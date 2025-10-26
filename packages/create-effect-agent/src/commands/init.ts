import { TUIError, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'
import {
    ECOSYSTEM_LIBRARIES,
    RESERVED_NAMES
} from '../constants'
import type { CLIConfig } from '../types'
import { ValidateError } from '../types'

export const initProject: Effect.Effect<CLIConfig, ValidateError | TUIError> =
    Effect.gen(function* (_) {
        const tui = new TUIHandler()

        // Collect project name
        const projectName = yield* _(
            tui
                .prompt('Project name:', { default: 'my-effect-app' })
                .pipe(
                    Effect.flatMap((name) => {
                        const normalized = name.toLowerCase().trim()

                        if (!normalized) {
                            return Effect.fail(
                                new ValidateError('Project name cannot be empty')
                            )
                        }

                        if (RESERVED_NAMES.includes(normalized)) {
                            return Effect.fail(
                                new ValidateError(
                                    `"${name}" is a reserved name. Choose another.`
                                )
                            )
                        }

                        if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(normalized)) {
                            return Effect.fail(
                                new ValidateError(
                                    'Project name must be a valid npm package name (lowercase, no spaces, can contain letters, numbers, hyphens, dots, underscores, and tildes)'
                                )
                            )
                        }

                        return Effect.succeed(normalized)
                    })
                )
        )

        // Select template
        const template = yield* _(
            tui.selectOption('Select template:', [
                { label: 'Basic', value: 'basic', description: 'Simple project' },
                { label: 'CLI', value: 'cli', description: 'CLI application' },
                { label: 'Monorepo', value: 'monorepo', description: 'Monorepo setup' }
            ])
        )

        // Select agents
        const agents = yield* _(
            tui.multiSelect('Select agents:', [
                { label: 'Claude', value: 'claude' },
                { label: 'Gemini', value: 'gemini' },
                { label: 'OpenAI', value: 'openai' }
            ])
        )

        // Select libraries
        const libraryOptions = Object.entries(ECOSYSTEM_LIBRARIES).map(
            ([name, meta]) => ({
                label: name,
                value: name,
                description: meta.description
            })
        )

        const libraries = yield* _(
            tui.multiSelect('Select ecosystem libraries:', libraryOptions)
        )

        // Select IDE rules
        const ideRules = yield* _(
            tui.multiSelect('Select IDE rules:', [
                { label: 'Cursor', value: 'cursor' },
                { label: 'VS Code', value: 'vscode' },
                { label: 'Windsurf', value: 'windsurf' }
            ])
        )

        // Confirm linting setup
        const setupLinting = yield* _(
            tui.confirm('Set up linting and formatting with Ultracite?')
        )

        // Confirm git setup
        const setupGit = yield* _(
            tui.confirm('Initialize git repository?')
        )

        // Return validated config
        return {
            projectName,
            projectPath: `./${projectName}`,
            template: template as CLIConfig['template'],
            agents: agents as CLIConfig['agents'],
            libraries: libraries as CLIConfig['libraries'],
            ideRules: ideRules as CLIConfig['ideRules'],
            setupLinting,
            setupGit
        }
    })
