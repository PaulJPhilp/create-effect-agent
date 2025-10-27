import * as Effect from 'effect/Effect'
import { GenerateConfig, ValidateError, FileError } from '../../types.js'
import { collectConfig } from '../../prompt.js'
import { renderBasicTemplate } from '../../template/basic/index.js'
import { ensureEmptyDir, writeFiles } from '../../fs.js'

/**
 * Generate command handler
 */
export const generate = (args: string[]): Effect.Effect<void, ValidateError | FileError> =>
  Effect.gen(function* (_) {
    // Parse arguments
    const config = parseArgs(args)

    // Collect configuration (interactive or defaults)
    const fullConfig = yield* _(collectConfig(config))

    // Validate target directory
    yield* _(ensureEmptyDir(fullConfig.path))

    // Render template
    const files = yield* _(renderBasicTemplate(fullConfig))

    // Write files
    yield* _(writeFiles(fullConfig.path, files))
  })

/**
 * Parse command line arguments for generate command
 */
const parseArgs = (args: string[]): GenerateConfig => {
  const config: GenerateConfig = {
    path: '',
    yes: false,
    noGit: false
  }

  let i = 0
  while (i < args.length) {
    const arg = args[i]
    if (i === 0 && !arg.startsWith('--')) {
      // First non-flag argument is the path
      config.path = arg
    } else if (arg === '--name' && i + 1 < args.length) {
      config.name = args[i + 1]
      i++
    } else if (arg === '--yes') {
      config.yes = true
    } else if (arg === '--no-git') {
      config.noGit = true
    }
    i++
  }

  if (!config.path) {
    console.error('Error: Missing required <path> argument')
    console.log('Use "create-effect-agent generate --help" for usage information.')
    process.exit(1)
  }

  return config
}
