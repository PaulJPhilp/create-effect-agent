import * as Effect from 'effect/Effect'
import { FullConfig, FileContent } from '../../types.js'
import { generatePackageJson } from '../../pkg.js'
import { generateRulesFiles } from '../../rules/index.js'

/**
 * Render basic template with all files
 */
export const renderBasicTemplate = (config: FullConfig): Effect.Effect<FileContent, never> =>
  Effect.gen(function* (_) {
    const files: FileContent = {}

    // Base template files
    Object.assign(files, getBaseTemplate(config))

    // Rules files
    const rulesFiles = yield* _(generateRulesFiles(config))
    Object.assign(files, rulesFiles)

    return files
  })

/**
 * Get base template files
 */
const getBaseTemplate = (config: FullConfig): FileContent => {
  const packageJson = generatePackageJson(config)

  return {
    'package.json': JSON.stringify(packageJson, null, 2),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        declaration: false,
        outDir: './dist',
        removeComments: true,
        strict: true,
        noImplicitReturns: true,
        noImplicitOverride: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        exactOptionalPropertyTypes: true,
        noImplicitAny: true,
        noImplicitThis: true,
        alwaysStrict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        isolatedModules: true,
        verbatimModuleSyntax: true,
        types: ['vitest/globals'],
        lib: config.typeScriptPack === 'front-end'
          ? ['ES2022', 'DOM', 'DOM.Iterable']
          : config.typeScriptPack === 'back-end'
          ? ['ES2022']
          : undefined
      },
      include: ['src/**/*', 'test/**/*'],
      exclude: ['node_modules', 'dist']
    }, null, 2),
    'tsconfig.build.json': JSON.stringify({
      extends: './tsconfig.json',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        outDir: './dist',
        removeComments: false,
        sourceMap: true,
        inlineSources: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'test/**/*']
    }, null, 2),
    'src/index.ts': getSrcIndex(config),
    'test/index.test.ts': getTestIndex(config),
    'vitest.config.ts': `/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true
  }
})
`,
    'README.md': getReadme(config),
    '.gitignore': `node_modules/
dist/
*.log
.DS_Store
.env
.env.local
coverage/
.vscode/settings.json
.idea/
`,
    '.editorconfig': `root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`
  }
}

/**
 * Generate src/index.ts based on Effect pack
 */
const getSrcIndex = (config: FullConfig): string => {
  const baseContent = `import * as Effect from 'effect/Effect'

/**
 * Example Effect function
 */
export const greet = (name: string): Effect.Effect<string> =>
  Effect.sync(() => \`Hello, \${name}! Welcome to ${config.name}.\`)

`

  switch (config.effectPack) {
    case 'Junior':
      return baseContent + `
/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('${config.name}'))
  console.log(message)
})
`
    case 'Intermediate':
      return baseContent + `
/**
 * Example Effect.Service for configuration
 */
export class ConfigService extends Effect.Service<ConfigService>()('ConfigService', {
  succeed: {
    appName: Effect.succeed('${config.name}')
  }
}) {}

/**
 * Example program using the greet function and service
 */
export const main: Effect.Effect<void, never, ConfigService> = Effect.gen(function* (_) {
  const config = yield* _(ConfigService)
  const message = yield* _(greet(config.appName))
  console.log(message)
})

// Layer to provide the service
export const ConfigLive = ConfigService.layerOf({
  appName: '${config.name}'
})
`
    case 'Senior':
      return baseContent + `
/**
 * Error taxonomy for the ${config.name} library
 */
export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly field: string
  readonly reason: string
}> {}

/**
 * Example Effect.Service with error handling
 */
export class DataService extends Effect.Service<DataService>()('DataService', {
  succeed: {
    validate: (data: unknown) => Effect.succeed(data),
    process: (data: string) => Effect.succeed(data.toUpperCase())
  }
}) {}

/**
 * Example program with composability and error handling
 */
export const main: Effect.Effect<void, ValidationError, DataService> = Effect.gen(function* (_) {
  const service = yield* _(DataService)

  // Compose operations
  const result = yield* _(
    Effect.succeed('hello')
      .pipe(Effect.flatMap(service.validate))
      .pipe(Effect.flatMap(service.process))
  )

  console.log('Processed:', result)
})

// Layer to provide the service
export const DataLive = DataService.layerOf({
  validate: (data: unknown) =>
    typeof data === 'string'
      ? Effect.succeed(data)
      : Effect.fail(new ValidationError({ field: 'input', reason: 'Must be string' })),
  process: (data: string) => Effect.succeed(data.toUpperCase())
})
`
    default:
      return baseContent + `
/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('${config.name}'))
  console.log(message)
})
`
  }
}

/**
 * Generate test/index.test.ts
 */
const getTestIndex = (config: FullConfig): string => {
  return `import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { greet${config.effectPack === 'Intermediate' ? ', ConfigLive' : config.effectPack === 'Senior' ? ', DataService, DataLive' : ''} } from '../src/index'

describe('${config.name}', () => {
  it('should greet correctly', () => {
    const result = Effect.runSync(greet('World'))
    expect(result).toBe('Hello, World! Welcome to ${config.name}.')
  })

  it('should handle Effect execution', () => {
    expect(() => Effect.runSync(greet('Test'))).not.toThrow()
  })
${config.effectPack === 'Intermediate' ? `
  it('should work with services', () => {
    const program = Effect.provide(greet('Service'), ConfigLive)
    const result = Effect.runSync(program)
    expect(result).toBe('Hello, Service! Welcome to ${config.name}.')
  })` : ''}
${config.effectPack === 'Senior' ? `
  it('should handle validation errors', () => {
    const program = Effect.provide(
      Effect.gen(function* (_) {
        const service = yield* _(DataService)
        return yield* _(service.validate(123)) // Should fail
      }),
      DataLive
    )
    expect(() => Effect.runSync(program)).toThrow()
  })` : ''}
})
`
}

/**
 * Generate README.md based on package manager and selected features
 */
const getReadme = (config: FullConfig): string => {
  const managerCommands = {
    npm: { install: 'npm install', run: 'npm run', dlx: 'npx' },
    pnpm: { install: 'pnpm install', run: 'pnpm', dlx: 'pnpm dlx' },
    bun: { install: 'bun install', run: 'bun run', dlx: 'bun x' }
  }

  const cmds = managerCommands[config.packageManager]

  let content = `# ${config.name}

A minimal Effect-TS library${config.ruleFormats.length > 0 ? ' with agentic development support' : ''}.

## Installation

\`\`\`bash
${cmds.install}
\`\`\`

## Usage

\`\`\`typescript
import { greet, main, Effect } from '${config.name}'

// Run the example program
Effect.runSync(main)

// Or use the greet function
const result = Effect.runSync(greet('World'))
console.log(result) // "Hello, World! Welcome to ${config.name}."
\`\`\`

## Development

\`\`\`bash
# Install dependencies
${cmds.install}

# Run tests
${cmds.run} test

# Build the library
${cmds.run} build

# Type check
${cmds.run} typecheck

# Format code
${cmds.run} format
\`\`\`
`

  if (config.typeScriptPack === 'front-end') {
    content += `
## Front-end Usage

This library is configured for front-end TypeScript development. For JSX support, ensure your tsconfig includes:

\`\`\`json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
\`\`\`
`
  }

  if (config.effectPack !== 'none') {
    content += `
## Effect Patterns

This library demonstrates ${config.effectPack} level Effect patterns${config.effectPack === 'Senior' ? ', including error taxonomy and service composition' : ''}.
`
  }

  if (config.ruleFormats.length > 0) {
    content += `
## Agentic Development

This project includes configuration for the following development tools:

${config.ruleFormats.map(format => `- **${format}**: See relevant configuration files`).join('\n')}
`
  }

  return content
}
