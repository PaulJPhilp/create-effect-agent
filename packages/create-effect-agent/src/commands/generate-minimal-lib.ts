import * as Effect from 'effect/Effect'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { GenerateConfig, GeneratedProject } from '../types'
import { GenerateError, ValidateError, FileError } from '../types.js'
import { createDirectory, pathExists, writeFile } from '../utils/file.js'

/**
 * generateMinimalLib: Generate a minimal Effect library project
 *
 * Creates a basic Effect-TS library with:
 * - package.json with proper exports and scripts
 * - TypeScript configuration (strict dev + build configs)
 * - Minimal Effect code in src/index.ts
 * - Vitest test configuration and sample test
 * - README with usage instructions
 * - .gitignore and .editorconfig
 * - Optional git initialization
 */
export const generateMinimalLib = (
    config: GenerateConfig
): Effect.Effect<GeneratedProject, GenerateError | ValidateError | FileError> =>
    Effect.gen(function* (_) {

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

        // Generate files
        console.log(`Creating minimal Effect library '${projectName}' at ${config.path}...`)

        // package.json
        const packageJson = {
            name: projectName,
            version: '0.0.1',
            description: 'A minimal Effect-TS library',
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
            keywords: ['effect', 'typescript', 'functional-programming'],
            author: '',
            license: 'MIT',
            dependencies: {
                effect: '^3.18.0',
                vitest: '^1.0.0'
            },
            devDependencies: {
                '@types/node': '^20.0.0',
                typescript: '^5.9.0',
                prettier: '^3.0.0'
            }
        }

        yield* _(writeFile(path.join(targetPath, 'package.json'), JSON.stringify(packageJson, null, 4)))

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

        yield* _(writeFile(path.join(targetPath, 'tsconfig.json'), JSON.stringify(tsconfigJson, null, 4)))

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

        yield* _(writeFile(path.join(targetPath, 'tsconfig.build.json'), JSON.stringify(tsconfigBuildJson, null, 4)))

        // Create src directory and index.ts
        const srcDir = path.join(targetPath, 'src')
        yield* _(createDirectory(srcDir))

        const indexTs = `import * as Effect from 'effect/Effect'

/**
 * Example Effect function
 */
export const greet = (name: string): Effect.Effect<string> =>
  Effect.sync(() => \`Hello, \${name}! Welcome to ${projectName}.\`)

/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('${projectName}'))
  console.log(message)
})
`

        yield* _(writeFile(path.join(srcDir, 'index.ts'), indexTs))

        // Create test directory and index.test.ts
        const testDir = path.join(targetPath, 'test')
        yield* _(createDirectory(testDir))

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

        yield* _(writeFile(path.join(testDir, 'index.test.ts'), indexTestTs))

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

        yield* _(writeFile(path.join(targetPath, 'vitest.config.ts'), vitestConfigTs))

        // README.md
        const readmeMd = `# ${projectName}

A minimal Effect-TS library.

## Installation

\`\`\`bash
npm install ${projectName}
# or
pnpm add ${projectName}
# or
yarn add ${projectName}
\`\`\`

## Usage

\`\`\`typescript
import { greet, main, Effect } from '${projectName}'

// Run the example program
Effect.runSync(main)

// Or use the greet function
const result = Effect.runSync(greet('World'))
console.log(result) // "Hello, World! Welcome to ${projectName}."
\`\`\`

## Development

\`\`\`bash
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
\`\`\`

## Compatibility

This library is compatible with [effect-supermemory](https://github.com/your-repo/effect-supermemory).
`

        yield* _(writeFile(path.join(targetPath, 'README.md'), readmeMd))

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

        yield* _(writeFile(path.join(targetPath, '.gitignore'), gitignore))

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

        yield* _(writeFile(path.join(targetPath, '.editorconfig'), editorconfig))

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

        console.log(`✓ Minimal Effect library '${projectName}' created successfully!`)

        return {
            name: projectName,
            path: targetPath,
            config: {
                projectName,
                projectPath: targetPath,
                template: 'basic' as any, // Minimal lib is like basic but more focused
                agents: [],
                libraries: [],
                ideRules: [],
                setupLinting: false,
                setupGit: !config.noGit
            },
            generatedAt: new Date()
        }
    })


