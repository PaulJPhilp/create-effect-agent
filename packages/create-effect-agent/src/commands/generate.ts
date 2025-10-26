import { CLIConfig, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'
import { GeneratedProject, GenerateError } from '../types'

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
    config: CLIConfig
): Effect.Effect<GeneratedProject, GenerateError> =>
    Effect.gen(function* (_) {
        const tui = new TUIHandler()

        // Log start
        yield* _(
            tui.display(
                `Creating project at ${config.projectPath}...`,
                'info'
            )
        )

        // TODO: Step 1 - Validate path doesn't exist
        // TODO: Step 2 - Create directory structure
        // TODO: Step 3 - Apply template files (substitute variables)
        // TODO: Step 4 - Copy IDE rules
        // TODO: Step 5 - Copy agent rules
        // TODO: Step 6 - Install libraries (pnpm install)
        // TODO: Step 7 - Initialize git (optional)
        // TODO: Step 8 - Run Ultracite (optional)

        // For now, return a mock success
        yield* _(
            tui.display(
                `Project created at ${config.projectPath}`,
                'success'
            )
        )

        return {
            name: config.projectName,
            path: config.projectPath,
            config,
            generatedAt: new Date()
        }
    })
