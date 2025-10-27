import * as Effect from 'effect/Effect'
import * as path from 'node:path'
import { GenerateConfig, FullConfig, PackageManager, RuleFormat, TypeScriptPack, EffectPack, ValidateError } from './types.js'

/**
 * Collect full configuration either interactively or from defaults
 */
export const collectConfig = (config: GenerateConfig): Effect.Effect<FullConfig, ValidateError> =>
  Effect.gen(function* (_) {
    if (config.yes) {
      // Non-interactive mode with defaults
      const projectName = config.name || 'my-effect-lib'
      return {
        ...config,
        packageManager: 'npm' as const,
        template: 'basic' as const,
        ruleFormats: [],
        typeScriptPack: 'none' as const,
        effectPack: 'none' as const,
        name: projectName
      }
    }

    // Interactive mode - load TUI dynamically to avoid ESM issues
    const { TUIHandler } = yield* _(Effect.tryPromise(() => import('effect-cli-tui')).pipe(
      Effect.catchAll(() => Effect.fail(new ValidateError('Failed to load interactive prompts')))
    ))

    const tui = new TUIHandler()

    // Project name
    const projectName = yield* _(promptProjectName(tui, config.name || 'my-effect-lib'))

    // Package manager
    const packageManager = yield* _(promptPackageManager(tui))

    // Template (basic only for Drop 1)
    const template = 'basic' as const

    // Rules formats
    const ruleFormats = yield* _(promptRuleFormats(tui))

    // Packs
    const typeScriptPack = yield* _(promptTypeScriptPack(tui))
    const effectPack = yield* _(promptEffectPack(tui))

    return {
      ...config,
      name: projectName,
      packageManager,
      template,
      ruleFormats,
      typeScriptPack,
      effectPack
    }
  })

/**
 * Prompt for project name with validation
 */
const promptProjectName = (tui: any, defaultName: string): Effect.Effect<string, ValidateError> =>
  Effect.gen(function* (_) {
    const name = yield* _(Effect.tryPromise(async () => {
      const result = await tui.prompt('Project name:', { default: defaultName })
      return result as string
    }).pipe(
      Effect.catchAll((error) => Effect.fail(new ValidateError('Failed to get project name')))
    ))

    // Validate kebab-case
    if (!/^[a-z][a-z0-9-]*$/.test(name) || name.includes('--') || name.length < 1 || name.length > 214) {
      return yield* _(Effect.fail(new ValidateError(
        'Project name must be in kebab-case (lowercase letters, numbers, and hyphens only, starting with a letter, no consecutive dashes, 1-214 characters)'
      )))
    }

    return name
  })

/**
 * Prompt for package manager
 */
const promptPackageManager = (tui: any): Effect.Effect<PackageManager, ValidateError> =>
  Effect.tryPromise(async () =>
    (await tui.selectOption('Package manager:', [
      { label: 'npm', value: 'npm', description: 'Node Package Manager' },
      { label: 'pnpm', value: 'pnpm', description: 'Performant NPM' },
      { label: 'bun', value: 'bun', description: 'Fast JavaScript runtime & bundler' }
    ])) as PackageManager
  ).pipe(
    Effect.catchAll((error) => Effect.fail(new ValidateError('Failed to select package manager')))
  )

/**
 * Prompt for rule formats (multi-select)
 */
const promptRuleFormats = (tui: any): Effect.Effect<RuleFormat[], ValidateError> =>
  Effect.tryPromise(async () =>
    (await tui.multiSelect('Select IDE and agent rules:', [
      { label: 'Cursor', value: 'Cursor', description: '.cursor/rules/agent.md' },
      { label: 'VS Code', value: 'VS Code', description: '.vscode/settings.json' },
      { label: 'Windsurf', value: 'Windsurf', description: '.windsurf/rules.md' },
      { label: 'Claude', value: 'Claude', description: 'docs/agents/Claude.md' },
      { label: 'OpenAI', value: 'OpenAI', description: 'docs/agents/OpenAI.md' },
      { label: 'Gemini', value: 'Gemini', description: 'docs/agents/Gemini.md' },
      { label: 'Agents.md', value: 'Agents.md', description: 'Aggregated agent guidance' }
    ])) as RuleFormat[]
  ).pipe(
    Effect.catchAll((error) => Effect.fail(new ValidateError('Failed to select rule formats')))
  )

/**
 * Prompt for TypeScript pack
 */
const promptTypeScriptPack = (tui: any): Effect.Effect<TypeScriptPack, ValidateError> =>
  Effect.tryPromise(async () =>
    (await tui.selectOption('TypeScript pack:', [
      { label: 'None', value: 'none', description: 'Basic TypeScript configuration' },
      { label: 'Back-end', value: 'back-end', description: 'Node.js types, exclude DOM' },
      { label: 'Front-end', value: 'front-end', description: 'DOM types, JSX guidance' }
    ])) as TypeScriptPack
  ).pipe(
    Effect.catchAll((error) => Effect.fail(new ValidateError('Failed to select TypeScript pack')))
  )

/**
 * Prompt for Effect pack
 */
const promptEffectPack = (tui: any): Effect.Effect<EffectPack, ValidateError> =>
  Effect.tryPromise(async () =>
    (await tui.selectOption('Effect pack:', [
      { label: 'None', value: 'none', description: 'Basic Effect usage' },
      { label: 'Junior', value: 'Junior', description: 'Basic Effect examples and comments' },
      { label: 'Intermediate', value: 'Intermediate', description: 'Effect.Service + Layer examples' },
      { label: 'Senior', value: 'Senior', description: 'Error taxonomy and composability notes' }
    ])) as EffectPack
  ).pipe(
    Effect.catchAll((error) => Effect.fail(new ValidateError('Failed to select Effect pack')))
  )
