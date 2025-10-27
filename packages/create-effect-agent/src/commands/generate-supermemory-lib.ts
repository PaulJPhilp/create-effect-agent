import * as Effect from 'effect/Effect'
import type { GenerateConfig } from '../types'
import { FileError } from '../types.js'

export const generateSupermemoryLib = (
    config: GenerateConfig
): Effect.Effect<Record<string, string>, FileError> =>
    Effect.gen(function* (_) {
        const projectName = config.name || 'my-effect-lib'

        // package.json
        const packageJson = {
            name: projectName,
            version: '0.0.1',
            description: 'A Supermemory Effect-TS library',
            type: 'module',
            main: 'dist/index.js',
            types: 'dist/index.d.ts',
            exports: {
                '.': {
                    types: './dist/index.d.ts',
                    import: './dist/index.js'
                }
            },
            scripts: {
                build: 'tsc -p tsconfig.build.json',
                typecheck: 'tsc --noEmit',
                test: 'vitest run',
                format: 'prettier --write src'
            },
            files: ['dist'],
            engines: {
                node: '>=18.18'
            },
            keywords: ['effect', 'typescript', 'functional-programming', 'supermemory'],
            author: '',
            license: 'MIT',
            dependencies: {
                effect: '^3.18.0',
                'effect-supermemory': '^0.2.5'
            },
            devDependencies: {
                '@types/node': '^20.0.0',
                typescript: '^5.9.0',
                vitest: '^1.0.0',
                prettier: '^3.0.0'
            }
        }

        // tsconfig.json (dev config)
        const tsconfigJson = {
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
                types: ['vitest/globals']
            },
            include: ['src/**/*', 'test/**/*'],
            exclude: ['node_modules', 'dist']
        }

        // tsconfig.build.json
        const tsconfigBuildJson = {
            extends: './tsconfig.json',
            compilerOptions: {
                declaration: true,
                declarationMap: true,
                outDir: './dist',
                removeComments: false,
                sourceMap: true
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist', 'test/**/*']
        }

        // Create src directory and index.ts
        const indexTs = `import * as Effect from 'effect/Effect'
export * from './supermemory/example'

/**
 * Example Effect function
 */
export const greet = (name: string): Effect.Effect<string> =>
  Effect.sync(() => `Hello, ${name}! Welcome to ${projectName}.`)

/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('${projectName}'))
  console.log(message)
})
`

        // Create src/supermemory directory and example.ts
        const supermemoryExampleTs = `import { Effect, Layer } from 'effect'
import { Supermemory, SupermemoryConfig } from 'effect-supermemory'

// Define the Supermemory configuration for the layer
const SupermemoryConfigLive = Layer.succeed(
  SupermemoryConfig,
  SupermemoryConfig.of({
    apiKey: process.env.SUPERMEMORY_API_KEY || '' // Placeholder for API key
  })
)

// Create a Supermemory layer with retries
export const SupermemoryLive = SupermemoryConfigLive.pipe(
  Layer.provide(Supermemory.Live),
  Layer.use(Supermemory.with  // Assuming Supermemory.with is the correct way to add retries
    Effect.retry({ times: 3, schedule: Effect.scheduleExponential(100) })
  )
)

// Example Effect that uses Supermemory
export const exampleSupermemoryEffect = (query: string) =>
  Effect.gen(function* (_) {
    const supermemory = yield* _(Supermemory.Supermemory)
    // In a real application, you would use supermemory.query or other methods
    // This is a placeholder to demonstrate wiring
    yield* _(Effect.log(`Querying Supermemory with: ${query}`))
    return `Response for: ${query}`
  }).pipe(Effect.provide(SupermemoryLive))
`

        // Create test directory and index.test.ts
        const indexTestTs = `import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { greet } from '../src/index'

describe('${projectName}', () => {
  it('should greet correctly', () => {
    const result = Effect.runSync(greet('World'))
    expect(result).toBe('Hello, World! Welcome to ${projectName}.')
  })

  it('should handle Effect execution', () => {
    expect(() => Effect.runSync(greet('Test'))).not.toThrow()
  })
})
`

        // Create test/supermemory.example.test.ts
        const supermemoryTestTs = `import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { Supermemory, SupermemoryConfig } from 'effect-supermemory'
import { exampleSupermemoryEffect } from '../src/supermemory/example'

describe('Supermemory Example', () => {
  it('should return a response for a given query (offline-safe)', () => {
    // Mock the Supermemory service to prevent actual network calls
    const MockSupermemoryLive = Layer.succeed(
      Supermemory.Supermemory,
      Supermemory.of({
        query: (query: string) => Effect.succeed(`Mocked response for: ${query}`),
        // Add other mocked methods as needed
      })
    )

    const program = exampleSupermemoryEffect('test query').pipe(
      Effect.provide(MockSupermemoryLive)
    )

    const result = Effect.runSync(program)
    expect(result).toBe('Response for: test query')
  })

  it('should use the provided API key from environment variables', () => {
    // Temporarily set an environment variable for testing
    process.env.SUPERMEMORY_API_KEY = 'test-api-key'

    const SupermemoryConfigLive = Layer.succeed(
      SupermemoryConfig,
      SupermemoryConfig.of({
        apiKey: process.env.SUPERMEMORY_API_KEY || ''
      })
    )

    const program = Effect.gen(function* (_) {
      const config = yield* _(SupermemoryConfig)
      return config.apiKey
    }).pipe(Effect.provide(SupermemoryConfigLive))

    const apiKey = Effect.runSync(program)
    expect(apiKey).toBe('test-api-key')

    // Clean up the environment variable
    delete process.env.SUPERMEMORY_API_KEY
  })
})
`

        // vitest.config.ts
        const vitestConfigTs = `/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true
  }
})
`

        // README.md
        const readmeMd = `# ${projectName}

A Supermemory Effect-TS library.

## Installation

\
```bash
npm install ${projectName}
# or
pnpm add ${projectName}
# or
yarn add ${projectName}
\
```

## Usage

\
```typescript
import { greet, main, Effect } from '${projectName}'

// Run the example program
Effect.runSync(main)

// Or use the greet function
const result = Effect.runSync(greet('World'))
console.log(result) // "Hello, World! Welcome to ${projectName}."
\
```

## Supermemory Quickstart

This template includes an example of how to integrate with 
`effect-supermemory`.

1.  **Set your Supermemory API Key:**

    Create a `.env` file in the root of your project and add your Supermemory API key:

    \
```
    SUPERMEMORY_API_KEY=your_supermemory_api_key_here
    \
```

    **Note:** For security, never commit your actual API key to version control. Use environment variables.

2.  **Run the example:**

    The `src/supermemory/example.ts` file contains an `exampleSupermemoryEffect` that demonstrates basic wiring with retries. You can run it as part of your application.

    \
```typescript
    import { exampleSupermemoryEffect, Effect } from './src'

    Effect.runPromise(exampleSupermemoryEffect("Hello Supermemory"))
    \
```

    The included test (`test/supermemory.example.test.ts`) provides an offline-safe example of how to test your Supermemory integration by mocking the service.

## Development

\
```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build

# Type check
pnpm typecheck

# Format code
pnpm format
\
```

## Compatibility

This library is compatible with [effect-supermemory](https://github.com/your-repo/effect-supermemory).
`

        // .gitignore
        const gitignore = `node_modules/
dist/
*.log
.DS_Store
.env
.env.local
coverage/
.vscode/settings.json
.idea/
`

        // .editorconfig
        const editorconfig = `root = true

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

        return {
            'package.json': JSON.stringify(packageJson, null, 4),
            'tsconfig.json': JSON.stringify(tsconfigJson, null, 4),
            'tsconfig.build.json': JSON.stringify(tsconfigBuildJson, null, 4),
            'src/index.ts': indexTs,
            'src/supermemory/example.ts': supermemoryExampleTs,
            'test/index.test.ts': indexTestTs,
            'test/supermemory.example.test.ts': supermemoryTestTs,
            'vitest.config.ts': vitestConfigTs,
            'README.md': readmeMd,
            '.gitignore': gitignore,
            '.editorconfig': editorconfig
        }
    })
