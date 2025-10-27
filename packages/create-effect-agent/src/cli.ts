import * as Effect from 'effect/Effect'
import { generate } from './commands/generate/index.js'
import { ValidateError, FileError } from './types.js'

/**
 * Main CLI entry point
 */
export const run = () => {
  Effect.runPromise(main()).catch((err) => {
    console.error('✗ Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  })
}

    const main = (): Effect.Effect<void, ValidateError | FileError, never> =>
  Effect.gen(function* (_) {
    const args = process.argv.slice(2)
    const [command, ...rest] = args

    if (command === 'generate') {
      const pathIndex = rest.findIndex(arg => !arg.startsWith('--'))
      const projectPath = pathIndex !== -1 ? rest[pathIndex] : undefined

      const nameIndex = rest.indexOf('--name')
      const projectName = nameIndex !== -1 && rest[nameIndex + 1] ? rest[nameIndex + 1] : undefined

      const yesFlag = rest.includes('--yes')
      const noGitFlag = rest.includes('--no-git')
      const templateIndex = rest.indexOf('--template')
      const template = templateIndex !== -1 && rest[templateIndex + 1] ? rest[templateIndex + 1] : undefined

      yield* _(generate({
        path: projectPath,
        name: projectName,
        yes: yesFlag,
        noGit: noGitFlag,
        template: template
      }))
    } else if (command === '--help' || command === '-h') {
      console.log(`
create-effect-agent - Bootstrap Effect-TS agentic projects

Usage:
  create-effect-agent generate <path> [options]

Options:
  --name <string>     Project name (kebab-case)
  --yes               Non-interactive mode with defaults
  --no-git            Skip git initialization
  --template <string> Project template (basic | supermemory). Defaults to basic.
  --help, -h          Show this help

Examples:
  # Interactive mode
  create-effect-agent generate ./my-project

  # Non-interactive with custom name
  create-effect-agent generate ./my-project --name my-awesome-lib --yes

  # Skip git
  create-effect-agent generate ./my-project --no-git

  # Use supermemory template
  create-effect-agent generate ./my-project --template supermemory --yes
      `.trim())
    } else {
      console.log('Use "create-effect-agent generate --help" for usage information.')
      process.exit(1)
    }
  })
