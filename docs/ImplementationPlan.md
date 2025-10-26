Perfect. Now let me draft **ImplementationPlan.md**:

---

# ImplementationPlan.md — create-effect-agent

## Overview

This document provides a step-by-step implementation roadmap for create-effect-agent, broken into Phase 1a (manual bootstrap) and Phase 1b (CLI automation).

**Total Estimated Scope**: Two distinct phases, each with clear deliverables and validation gates.

---

## Phase 1a: Manual Bootstrap + effect-cli-tui Integration

### Objective
Manually set up the monorepo, configure tooling, and build the effect-cli-tui package in isolation. This hands-on process informs what Phase 1b will automate.

### High-Level Steps

1. **Monorepo Setup**
2. **Workspace Configuration**
3. **TypeScript + Effect Setup**
4. **effect-cli-tui Package Development**
5. **Integration Testing**
6. **Documentation**

---

### Step 1: Monorepo Setup

**Goal**: Create the basic directory structure and initialize the monorepo.

**Tasks**:
1. Create `/packages` directory
2. Create `/packages/effect-cli-tui` directory with:
   - `package.json`
   - `tsconfig.json`
   - `src/` directory
3. Create `/packages/create-effect-agent` directory with same structure
4. Create root `pnpm-workspace.yaml`
5. Create root `turbo.json`
6. Create root `.gitignore`

**Deliverables**:
- [ ] Directory structure matches Architecture.md
- [ ] Root `pnpm-workspace.yaml` lists both packages
- [ ] Root `turbo.json` defines build tasks
- [ ] Both packages have minimal `package.json` and `tsconfig.json`

**Validation**:
```bash
pnpm install  # Should recognize both packages as workspace members
```

---

### Step 2: Workspace Configuration

**Goal**: Configure pnpm workspaces and Turborepo for monorepo development.

**Tasks**:

#### 2.1 pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
```

#### 2.2 turbo.json
```json
{
  "version": "2",
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "cache": false
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "format": {
      "outputs": []
    }
  }
}
```

#### 2.3 Root package.json
```json
{
  "name": "create-effect-agent",
  "version": "0.0.1",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "format": "turbo format"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

**Deliverables**:
- [ ] Root `pnpm-workspace.yaml` configured
- [ ] Root `turbo.json` configured
- [ ] Root `package.json` with workspace scripts
- [ ] `.npmrc` or similar for pnpm settings (if needed)

**Validation**:
```bash
pnpm install
pnpm list  # Shows both packages
```

---

### Step 3: TypeScript + Effect Setup

**Goal**: Configure TypeScript 5.9 and Effect 3.18 for both packages.

**Tasks**:

#### 3.1 Root tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3.2 effect-cli-tui/package.json
```json
{
  "name": "effect-cli-tui",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "format": "prettier --write src"
  },
  "dependencies": {
    "effect": "^3.18.0",
    "opentui": "latest"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/node": "^20.0.0"
  }
}
```

#### 3.3 create-effect-agent/package.json
```json
{
  "name": "create-effect-agent",
  "version": "0.0.1",
  "bin": {
    "create-effect-agent": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "format": "prettier --write src"
  },
  "dependencies": {
    "effect": "^3.18.0",
    "effect-cli-tui": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/node": "^20.0.0"
  }
}
```

#### 3.4 Add Ultracite Configuration
Create root `ultracite.config.ts`:
```typescript
export default {
  typescript: true,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5'
}
```

**Deliverables**:
- [ ] Root `tsconfig.json` configured
- [ ] Both packages have `package.json` with Effect + TypeScript deps
- [ ] Both packages have `tsconfig.json` (or inherit from root)
- [ ] Ultracite config created
- [ ] `pnpm install` succeeds and resolves all dependencies

**Validation**:
```bash
pnpm install
pnpm build  # Should compile successfully
```

---

### Step 4: effect-cli-tui Package Development

**Goal**: Implement the core effect-cli-tui package (CLI wrapper + TUI handler).

**Tasks**:

#### 4.1 Create Type Definitions
File: `packages/effect-cli-tui/src/types.ts`

```typescript
import * as Data from 'effect/Data'

export type TemplateType = 'basic' | 'cli' | 'monorepo'
export type Agent = 'claude' | 'gemini' | 'openai'
export type IDE = 'cursor' | 'vscode' | 'windsurf'
export type Library = 'effect-end' | 'effect-mdx' | 'effect-regex'

export interface CLIConfig {
  projectName: string
  projectPath: string
  template: TemplateType
  agents: Agent[]
  libraries: Library[]
  ideRules: IDE[]
  setupLinting: boolean
  setupGit: boolean
}

export interface SelectOption {
  label: string
  value: string
  description?: string
}

export interface CLIResult {
  exitCode: number
  stdout: string
  stderr: string
}

export interface PromptOptions {
  default?: string
  validate?: (input: string) => boolean | string
}

// Error types
export class CLIError extends Data.TaggedError('CLIError') {
  constructor(
    readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound',
    readonly message: string
  ) {
    super()
  }
}

export class TUIError extends Data.TaggedError('TUIError') {
  constructor(
    readonly reason: 'Cancelled' | 'ValidationFailed' | 'RenderError',
    readonly message: string
  ) {
    super()
  }
}
```

#### 4.2 Implement CLI Wrapper
File: `packages/effect-cli-tui/src/cli.ts`

```typescript
import { spawn } from 'child_process'
import * as Effect from 'effect/Effect'
import * as Stream from 'effect/Stream'
import { CLIError, CLIResult, CLIRunOptions } from './types'

export class EffectCLI {
  run(
    command: string,
    args: string[] = [],
    options: CLIRunOptions = {}
  ): Effect.Effect<CLIResult, CLIError> {
    return Effect.async((resume) => {
      const cwd = options.cwd || process.cwd()
      let stdout = ''
      let stderr = ''

      const child = spawn('effect', [command, ...args], {
        cwd,
        env: { ...process.env, ...options.env }
      })

      if (!child.stdout || !child.stderr) {
        return resume(
          Effect.fail(
            new CLIError('NotFound', 'Failed to spawn Effect CLI process')
          )
        )
      }

      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      const timeout = options.timeout ? setTimeout(() => {
        child.kill()
        resume(
          Effect.fail(
            new CLIError('Timeout', `Command timed out after ${options.timeout}ms`)
          )
        )
      }, options.timeout) : null

      child.on('close', (exitCode) => {
        if (timeout) clearTimeout(timeout)
        
        if (exitCode === 0) {
          resume(Effect.succeed({ exitCode, stdout, stderr }))
        } else {
          resume(
            Effect.fail(
              new CLIError(
                'CommandFailed',
                `Command failed with exit code ${exitCode}.\n${stderr}`
              )
            )
          )
        }
      })

      child.on('error', (err) => {
        if (timeout) clearTimeout(timeout)
        resume(
          Effect.fail(
            new CLIError('NotFound', `Failed to execute: ${err.message}`)
          )
        )
      })
    })
  }

  stream(
    command: string,
    args: string[] = [],
    options: CLIRunOptions = {}
  ): Effect.Effect<void, CLIError> {
    return Effect.async((resume) => {
      const cwd = options.cwd || process.cwd()
      
      const child = spawn('effect', [command, ...args], {
        cwd,
        env: { ...process.env, ...options.env },
        stdio: 'inherit'
      })

      child.on('close', (exitCode) => {
        if (exitCode === 0) {
          resume(Effect.succeed(undefined))
        } else {
          resume(
            Effect.fail(
              new CLIError(
                'CommandFailed',
                `Command failed with exit code ${exitCode}`
              )
            )
          )
        }
      })

      child.on('error', (err) => {
        resume(
          Effect.fail(
            new CLIError('NotFound', `Failed to execute: ${err.message}`)
          )
        )
      })
    })
  }
}
```

#### 4.3 Implement TUI Handler
File: `packages/effect-cli-tui/src/tui.ts`

```typescript
import * as Effect from 'effect/Effect'
import { TUIError, SelectOption, PromptOptions } from './types'

// For now, we'll create a simple implementation
// In Phase 1a validation, we'll integrate with OpenTui properly

export class TUIHandler {
  selectOption(
    message: string,
    options: SelectOption[]
  ): Effect.Effect<string, TUIError> {
    return Effect.sync(() => {
      // Placeholder: In Phase 1a, we validate this works with OpenTui
      console.log(`\n${message}`)
      options.forEach((opt, i) => {
        console.log(`${i + 1}. ${opt.label}`)
      })
      // For now, return first option
      // Real implementation will use OpenTui
      return options[0].value
    }).pipe(
      Effect.catchAll(() =>
        Effect.fail(
          new TUIError('RenderError', 'Failed to render select dialog')
        )
      )
    )
  }

  prompt(
    message: string,
    options?: PromptOptions
  ): Effect.Effect<string, TUIError> {
    return Effect.sync(() => {
      console.log(`\n${message}`)
      // Placeholder: Real implementation will use OpenTui
      return options?.default || 'default-input'
    }).pipe(
      Effect.catchAll(() =>
        Effect.fail(
          new TUIError('RenderError', 'Failed to render prompt dialog')
        )
      )
    )
  }

  confirm(message: string): Effect.Effect<boolean, TUIError> {
    return Effect.sync(() => {
      console.log(`\n${message} (y/n)`)
      // Placeholder: Real implementation will use OpenTui
      return true
    }).pipe(
      Effect.catchAll(() =>
        Effect.fail(
          new TUIError('RenderError', 'Failed to render confirm dialog')
        )
      )
    )
  }

  multiSelect(
    message: string,
    options: SelectOption[]
  ): Effect.Effect<string[], TUIError> {
    return Effect.sync(() => {
      console.log(`\n${message}`)
      options.forEach((opt, i) => {
        console.log(`${i + 1}. ${opt.label}`)
      })
      // Placeholder: Return all options
      return options.map(opt => opt.value)
    }).pipe(
      Effect.catchAll(() =>
        Effect.fail(
          new TUIError('RenderError', 'Failed to render multi-select dialog')
        )
      )
    )
  }

  display(
    message: string,
    type: 'info' | 'success' | 'error'
  ): Effect.Effect<void> {
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'
    return Effect.sync(() => {
      console.log(`\n${prefix} ${message}`)
    })
  }
}
```

#### 4.4 Create Index Export
File: `packages/effect-cli-tui/src/index.ts`

```typescript
export * from './types'
export * from './cli'
export * from './tui'

export { EffectCLI } from './cli'
export { TUIHandler } from './tui'
```

**Deliverables**:
- [ ] `types.ts` with all type definitions
- [ ] `cli.ts` with EffectCLI class
- [ ] `tui.ts` with TUIHandler class
- [ ] `index.ts` with exports
- [ ] Package builds successfully: `pnpm -F effect-cli-tui build`

**Validation**:
```bash
cd packages/effect-cli-tui
pnpm build
ls -la dist/  # Should have compiled JS and types
```

---

### Step 5: Integration Testing

**Goal**: Validate that effect-cli-tui works with Effect CLI and OpenTui.

**Tasks**:

#### 5.1 Create Integration Test
File: `packages/effect-cli-tui/src/__tests__/integration.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { EffectCLI, TUIHandler, CLIError } from '../index'

describe('effect-cli-tui Integration', () => {
  describe('EffectCLI', () => {
    it('should run Effect CLI version command', async () => {
      const cli = new EffectCLI()
      const result = await Effect.runPromise(
        cli.run('--version', [])
      )
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toBeDefined()
    })

    it('should handle command failure', async () => {
      const cli = new EffectCLI()
      const result = Effect.runPromise(
        cli.run('invalid-command', [])
      )
      expect(result).rejects.toThrow(CLIError)
    })
  })

  describe('TUIHandler', () => {
    it('should render select option', async () => {
      const handler = new TUIHandler()
      const result = await Effect.runPromise(
        handler.selectOption('Choose one:', [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ])
      )
      expect(['opt1', 'opt2']).toContain(result)
    })

    it('should render prompt', async () => {
      const handler = new TUIHandler()
      const result = await Effect.runPromise(
        handler.prompt('Enter name:', { default: 'test' })
      )
      expect(result).toBeDefined()
    })
  })
})
```

#### 5.2 Setup Vitest
File: `packages/effect-cli-tui/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
```

#### 5.3 Update package.json
Add test script:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

**Deliverables**:
- [ ] Integration test file created
- [ ] Vitest configured
- [ ] Tests pass: `pnpm -F effect-cli-tui test`

**Validation**:
```bash
cd packages/effect-cli-tui
pnpm test
# Should show passing tests for CLI and TUI
```

---

### Step 6: Documentation

**Goal**: Document the manual bootstrap process (becomes the blueprint for Phase 1b).

**Tasks**:

#### 6.1 Create MANUAL_BOOTSTRAP.md
File: `docs/MANUAL_BOOTSTRAP.md`

Document each step from Steps 1-5:
- What was created
- Why it matters
- Key configuration decisions
- Lessons learned

#### 6.2 Update Root README.md
File: `README.md`

```markdown
# create-effect-agent

Bootstrap agentic Effect projects with pre-configured rules and agent support.

## Status

**Phase 1a** (Manual Bootstrap): ✓ Complete
- Monorepo structure established
- effect-cli-tui package implemented and tested
- Effect CLI + OpenTui integration validated

**Phase 1b** (CLI Automation): In Progress
- Will automate Phase 1a manual steps

## Quick Start

```bash
pnpm install
pnpm build
pnpm test
```

## Project Structure

See [Architecture.md](./docs/Architecture.md)

## Implementation Plan

See [ImplementationPlan.md](./docs/ImplementationPlan.md)
```

**Deliverables**:
- [ ] `MANUAL_BOOTSTRAP.md` documenting Phase 1a
- [ ] Root `README.md` updated with project status
- [ ] Clear record of all decisions and insights

---

### Phase 1a Completion Checklist

- [ ] Monorepo structure created and working
- [ ] pnpm workspaces configured
- [ ] TypeScript + Effect + Ultracite setup complete
- [ ] effect-cli-tui package implemented
  - [ ] Types defined
  - [ ] EffectCLI implemented
  - [ ] TUIHandler implemented
  - [ ] Package builds successfully
- [ ] Integration tests passing
- [ ] Manual bootstrap documented
- [ ] README updated

**Gate**: All items checked ✓ → Proceed to Phase 1b

---

## Phase 1b: create-effect-agent CLI Implementation

### Objective
Automate Phase 1a manual steps by building the create-effect-agent CLI on top of effect-cli-tui.

### High-Level Steps

1. **Create Package Structure**
2. **Implement Commands (init, generate)**
3. **Create Templates**
4. **Create IDE Rules**
5. **Create Agent Rules**
6. **Integrate Git + Linting**
7. **End-to-End Testing**
8. **Documentation**

---

### Step 1: Create Package Structure

**Goal**: Set up directory structure for create-effect-agent package.

**Tasks**:

1. Create subdirectories:
   ```
   packages/create-effect-agent/src/
   ├── index.ts
   ├── commands/
   │   ├── init.ts
   │   ├── configure.ts
   │   └── generate.ts
   ├── templates/
   │   ├── basic/
   │   ├── cli/
   │   ├── monorepo/
   │   └── shared/
   ├── rules/
   │   ├── cursor/
   │   ├── vscode/
   │   ├── windsurf/
   │   └── agents/
   ├── utils/
   │   ├── file.ts
   │   ├── template.ts
   │   ├── git.ts
   │   └── linting.ts
   ├── types.ts
   └── constants.ts
   ```

2. Create template files (see Step 3)
3. Create rule files (see Step 4)

**Deliverables**:
- [ ] Directory structure matches Architecture.md
- [ ] All directories exist and have placeholder files

---

### Step 2: Implement Commands

#### 2.1 types.ts — CLI-Specific Types

File: `packages/create-effect-agent/src/types.ts`

```typescript
import * as Data from 'effect/Data'
import { CLIConfig } from 'effect-cli-tui'

export interface GeneratedProject {
  name: string
  path: string
  config: CLIConfig
  generatedAt: Date
}

export interface TemplateFile {
  source: string
  destination: string
  isTemplate: boolean
}

export interface VariableDefinition {
  description: string
  default?: string
  validate?: (value: string) => boolean
}

export class InitError extends Data.TaggedError('InitError') {
  constructor(readonly message: string) {
    super()
  }
}

export class GenerateError extends Data.TaggedError('GenerateError') {
  constructor(
    readonly message: string,
    readonly step: 'template' | 'rules' | 'install' | 'git' | 'lint',
    readonly context?: Record<string, unknown>
  ) {
    super()
  }
}

export class ValidateError extends Data.TaggedError('ValidateError') {
  constructor(readonly message: string) {
    super()
  }
}
```

#### 2.2 constants.ts — Configuration Constants

File: `packages/create-effect-agent/src/constants.ts`

```typescript
export const RESERVED_NAMES = [
  'effect',
  'node_modules',
  'package',
  'test',
  'lib',
  'src'
]

export const DEFAULT_TEMPLATE = 'basic'
export const DEFAULT_AGENTS = ['claude']
export const DEFAULT_LIBRARIES = []
export const DEFAULT_IDE_RULES = ['vscode']

export const ECOSYSTEM_LIBRARIES = {
  'effect-end': { version: 'latest', description: 'Effects for HTTP' },
  'effect-mdx': { version: 'latest', description: 'MDX utilities' },
  'effect-regex': { version: 'latest', description: 'Regex utilities' }
}

export const SUPPORTED_AGENTS = ['claude', 'gemini', 'openai']
export const SUPPORTED_IDES = ['cursor', 'vscode', 'windsurf']
export const SUPPORTED_TEMPLATES = ['basic', 'cli', 'monorepo']
```

#### 2.3 commands/init.ts — Project Initialization

File: `packages/create-effect-agent/src/commands/init.ts`

```typescript
import * as Effect from 'effect/Effect'
import { CLIConfig } from 'effect-cli-tui'
import { TUIHandler } from 'effect-cli-tui'
import { ValidateError } from '../types'
import {
  RESERVED_NAMES,
  SUPPORTED_TEMPLATES,
  SUPPORTED_AGENTS,
  SUPPORTED_IDES,
  ECOSYSTEM_LIBRARIES
} from '../constants'

export const initProject: Effect.Effect<CLIConfig, ValidateError> =
  Effect.gen(function*(_) {
    const tui = new TUIHandler()

    const projectName = yield* _(
      tui.prompt('Project name:')
    )

    if (RESERVED_NAMES.includes(projectName.toLowerCase())) {
      return yield* _(
        Effect.fail(
          new ValidateError(
            `"${projectName}" is a reserved name. Choose another.`
          )
        )
      )
    }

    const template = yield* _(
      tui.selectOption('Select template:', [
        { label: 'Basic', value: 'basic', description: 'Simple project' },
        { label: 'CLI', value: 'cli', description: 'CLI application' },
        { label: 'Monorepo', value: 'monorepo', description: 'Monorepo setup' }
      ])
    )

    const agents = yield* _(
      tui.multiSelect('Select agents:', [
        { label: 'Claude', value: 'claude' },
        { label: 'Gemini', value: 'gemini' },
        { label: 'OpenAI', value: 'openai' }
      ])
    )

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

    const ideRules = yield* _(
      tui.multiSelect('Select IDE rules:', [
        { label: 'Cursor', value: 'cursor' },
        { label: 'VS Code', value: 'vscode' },
        { label: 'Windsurf', value: 'windsurf' }
      ])
    )

    const setupLinting = yield* _(
      tui.confirm('Set up linting and formatting with Ultracite?')
    )

    const setupGit = yield* _(
      tui.confirm('Initialize git repository?')
    )

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
```

#### 2.4 commands/generate.ts — Project Generation

File: `packages/create-effect-agent/src/commands/generate.ts`

```typescript
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import { CLIConfig, TUIHandler } from 'effect-cli-tui'
import { GeneratedProject, GenerateError } from '../types'
import * as FileUtils from '../utils/file'
import * as TemplateUtils from '../utils/template'
import * as GitUtils from '../utils/git'
import * as LintingUtils from '../utils/linting'

export const generateProject = (
  config: CLIConfig
): Effect.Effect<GeneratedProject, GenerateError> =>
  Effect.gen(function*(_) {
    const tui = new TUIHandler()
    const fs = yield* _(FileSystem.FileSystem)

    // 1. Validate project path
    yield* _(
      tui.display(`Creating project at ${config.projectPath}...`, 'info')
    )

    const pathExists = yield* _(
      fs.exists(config.projectPath).pipe(
        Effect.option,
        Effect.map(opt => opt._tag === 'Some')
      )
    )

    if (pathExists) {
      return yield* _(
        Effect.fail(
          new GenerateError(
            `Directory ${config.projectPath} already exists`,
            'template'
          )
        )
      )
    }

    // 2. Create directory structure
    yield* _(
      FileUtils.createDirectory(config.projectPath)
    )

    // 3. Apply template
    yield* _(
      TemplateUtils.applyTemplate(
        config.projectPath,
        config.template,
        config.projectName
      )
    )

    // 4. Copy IDE rules
    for (const ide of config.ideRules) {
      yield* _(
        FileUtils.copyIDERules(
          config.projectPath,
          ide,
          config.projectName
        )
      )
    }

    // 5. Copy agent rules
    yield* _(
      FileUtils.copyAgentRules(
        config.projectPath,
        config.agents,
        config.projectName
      )
    )

    // 6. Install dependencies
    yield* _(
      TemplateUtils.installDependencies(
        config.projectPath,
        config.libraries
      )
    )

    // 7. Initialize git (optional)
    if (config.setupGit) {
      yield* _(
        tui.display('Initializing git repository...', 'info')
      )
      yield* _(GitUtils.init(config.projectPath))
      yield* _(GitUtils.addAll(config.projectPath))
      yield* _(GitUtils.commit(config.projectPath, 'Initial commit'))
    }

    // 8. Run Ultracite (optional)
    if (config.setupLinting) {
      yield* _(
        tui.display('Setting up linting and formatting...', 'info')
      )
      yield* _(LintingUtils.runUltracite(config.projectPath))
    }

    // 9. Display success
    yield* _(
      tui.display(
        `✓ Project "${config.projectName}" created successfully!`,
        'success'
      )
    )
    yield* _(
      tui.display(
        `Next steps:\n  cd ${config.projectPath}\n  pnpm install\n  pnpm dev`,
        'info'
      )
    )

    return {
      name: config.projectName,
      path: config.projectPath,
      config,
      generatedAt: new Date()
    }
  })
```

**Deliverables**:
- [ ] `types.ts` with CLI-specific types
- [ ] `constants.ts` with configuration
- [ ] `commands/init.ts` with initProject function
- [ ] `commands/generate.ts` with generateProject function

---

### Step 3: Create Templates

**Goal**: Create pre-configured project templates with variable substitution.

**Tasks**:

#### 3.1 Basic Template

File: `packages/create-effect-agent/src/templates/basic/package.json.template`

```json
{
  "name": "{{projectName}}",
  "version": "0.0.1",
  "description": "An agentic Effect project",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest",
    "lint": "eslint src",
    "format": "prettier --write src"
  },
  "dependencies": {
    "effect": "^3.18.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "tsx": "^4.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "@types/node": "^20.0.0"
  }
}
```

File: `packages/create-effect-agent/src/templates/basic/tsconfig.json.template`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

File: `packages/create-effect-agent/src/templates/basic/src/index.ts.template`

```typescript
import * as Effect from 'effect/Effect'

// Welcome to {{projectName}}!
// This is a basic Effect project.

const main: Effect.Effect<void> = Effect.log('Hello from Effect!')

Effect.runSync(main)
```

File: `packages/create-effect-agent/src/templates/basic/ultracite.config.ts`

```typescript
export default {
  typescript: true,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5'
}
```

File: `packages/create-effect-agent/src/templates/shared/.gitignore`

```
node_modules
dist
.env
.DS_Store
*.log
coverage
```

#### 3.2 CLI Template (Similar structure, different starter code)

#### 3.3 Monorepo Template

File: `packages/create-effect-agent/src/templates/monorepo/pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

File: `packages/create-effect-agent/src/templates/monorepo/turbo.json`

```json
{
  "version": "2",
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "cache": false
    },
    "test": {
      "cache": false
    },
    "lint": {
      "cache": false
    },
    "format": {
      "cache": false
    }
  }
}
```

**Deliverables**:
- [ ] Basic template with package.json, tsconfig, src/index.ts
- [ ] CLI template with starter CLI code
- [ ] Monorepo template with pnpm-workspace.yaml and turbo.json
- [ ] Shared templates (.gitignore, ultracite.config.ts)

---

### Step 4: Create IDE Rules

**Goal**: Create IDE-specific rule files.

**Tasks**:

#### 4.1 Cursor Rules

File: `packages/create-effect-agent/src/rules/cursor/.cursor/rules.md`

```markdown
# Effect Development Rules for {{projectName}}

## Principles

- Use Effect-TS for all async operations
- Prefer functional, declarative code
- Use Effect patterns from the Effect Patterns library

## Code Style

- Use PascalCase for Effect Effect types
- Use camelCase for functions and variables
- Keep functions pure when possible
- Use Effect.gen for readable async code

## Project Setup

- TypeScript 5.9+
- Effect 3.18+
- ESLint + Prettier for code quality

See root README for more details.
```

#### 4.2 VS Code Settings

File: `packages/create-effect-agent/src/rules/vscode/.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["typescript"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

File: `packages/create-effect-agent/src/rules/vscode/.vscode/extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "orta.vscode-twoslash-queries"
  ]
}
```

#### 4.3 Windsurf Rules

Similar to Cursor rules.

**Deliverables**:
- [ ] Cursor rules (.cursor/rules.md)
- [ ] VS Code settings (.vscode/settings.json)
- [ ] Windsurf rules (.windsurf/rules.md)

---

### Step 5: Create Agent Rules

**Goal**: Create agent instruction files.

**Tasks**:

#### 5.1 Claude.md

File: `packages/create-effect-agent/src/rules/agents/Claude.md`

```markdown
# Instructions for Claude in {{projectName}}

## Context

You are an AI assistant helping with {{projectName}}, an Effect-TS project.

## Guidelines

- Use Effect-TS patterns for all async code
- Refer to the Effect documentation when uncertain
- Follow TypeScript best practices
- Write tests for critical functions

## Project Structure

- `src/`: Source code
- `dist/`: Compiled output
- `test/`: Test files

## Key Technologies

- Effect 3.18.0
- TypeScript 5.9
- Node.js runtime

See other .md files for project-specific guidance.
```

#### 5.2 Gemini.md and Agents.md

Similar structure, tailored for each agent.

**Deliverables**:
- [ ] Claude.md with Claude-specific instructions
- [ ] Gemini.md with Gemini-specific instructions
- [ ] Agents.md with general agent guidance

---

### Step 6: Implement Utilities

#### 6.1 utils/file.ts

File: `packages/create-effect-agent/src/utils/file.ts`

```typescript
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Path from 'node:path'
import { GenerateError } from '../types'

export const createDirectory = (
  path: string
): Effect.Effect<void, GenerateError> =>
  Effect.gen(function*(_) {
    const fs = yield* _(FileSystem.FileSystem)
    try {
      yield* _(fs.mkdir(path, { recursive: true }))
    } catch (err) {
      return yield* _(
        Effect.fail(
          new GenerateError(
            `Failed to create directory: ${err}`,
            'template'
          )
        )
      )
    }
  })

export const copyFile = (
  src: string,
  dest: string
): Effect.Effect<void, GenerateError> =>
  Effect.gen(function*(_) {
    const fs = yield* _(FileSystem.FileSystem)
    try {
      const content = yield* _(fs.readFileString(src))
      yield* _(fs.writeFileString(dest, content))
    } catch (err) {
      return yield* _(
        Effect.fail(
          new GenerateError(
            `Failed to copy file: ${err}`,
            'template'
          )
        )
      )
    }
  })

export const copyIDERules = (
  projectPath: string,
  ide: string,
  projectName: string
): Effect.Effect<void, GenerateError> => {
  // Copy IDE-specific rules from rules/ to project
  // Implementation pending
  return Effect.void
}

export const copyAgentRules = (
  projectPath: string,
  agents: string[],
  projectName: string
): Effect.Effect<void, GenerateError> => {
  // Copy agent rules from rules/ to project
  // Implementation pending
  return Effect.void
}
```

#### 6.2 utils/template.ts

File: `packages/create-effect-agent/src/utils/template.ts`

```typescript
import * as Effect from 'effect/Effect'
import { GenerateError } from '../types'

export const processTemplate = (
  content: string,
  variables: Record<string, string>
): Effect.Effect<string, GenerateError> =>
  Effect.sync(() => {
    let result = content
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return result
  })

export const applyTemplate = (
  projectPath: string,
  template: string,
  projectName: string
): Effect.Effect<void, GenerateError> => {
  // Load template files, process variables, write to project
  // Implementation pending
  return Effect.void
}

export const installDependencies = (
  projectPath: string,
  libraries: string[]
): Effect.Effect<void, GenerateError> => {
  // Run pnpm install + pnpm add for libraries
  // Implementation pending
  return Effect.void
}
```

#### 6.3 utils/git.ts

File: `packages/create-effect-agent/src/utils/git.ts`

```typescript
import * as Effect from 'effect/Effect'
import { GenerateError } from '../types'

export const init = (
  path: string
): Effect.Effect<void, GenerateError> => {
  // git init in path
  // Implementation pending
  return Effect.void
}

export const addAll = (
  path: string
): Effect.Effect<void, GenerateError> => {
  // git add . in path
  // Implementation pending
  return Effect.void
}

export const commit = (
  path: string,
  message: string
): Effect.Effect<void, GenerateError> => {
  // git commit with message
  // Implementation pending
  return Effect.void
}
```

#### 6.4 utils/linting.ts

File: `packages/create-effect-agent/src/utils/linting.ts`

```typescript
import * as Effect from 'effect/Effect'
import { GenerateError } from '../types'

export const runUltracite = (
  path: string
): Effect.Effect<void, GenerateError> => {
  // Run ultracite format in path
  // Implementation pending
  return Effect.void
}
```

**Deliverables**:
- [ ] `file.ts` with file operations
- [ ] `template.ts` with template processing
- [ ] `git.ts` with git operations
- [ ] `linting.ts` with linting operations

---

### Step 7: Create Entry Point

#### 7.1 index.ts — Main CLI Entry

File: `packages/create-effect-agent/src/index.ts`

**Purpose**: Single unified Effect program orchestrating the complete workflow. All I/O flows through TUIHandler (effect-cli-tui). No external CLI frameworks.

```typescript
#!/usr/bin/env node

import { TUIError, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'
import { generateProject } from './commands/generate'
import { initProject } from './commands/init'
import { GenerateError, ValidateError } from './types'

/**
 * Single unified Effect program orchestrating the workflow:
 * 1. Display welcome message
 * 2. Run interactive initialization (collect configuration via TUIHandler)
 * 3. Generate the project
 * 4. Display success message
 */
const main: Effect.Effect<void, ValidateError | GenerateError | TUIError> = 
  Effect.gen(function* (_) {
    const tui = new TUIHandler()

    // Display welcome
    yield* _(
      tui.display('🚀 Welcome to create-effect-agent!', 'info')
    )
    yield* _(
      tui.display(
        'Bootstrap Effect-TS agentic projects with IDE rules and agent guidance',
        'info'
      )
    )

    // Collect configuration interactively
    const config = yield* _(initProject)

    // Generate project
    const project = yield* _(generateProject(config))

    // Display success
    yield* _(
      tui.display(
        `✓ Project created at ${project.path}`,
        'success'
      )
    )
    yield* _(
      tui.display(
        'Run `cd ' + project.path + ' && npm start` to get started!',
        'info'
      )
    )
  })

// Execute the main program
Effect.runPromise(main).catch((err) => {
  console.error('✗ Error:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
```

**Design Principles:**
- Single unified command (no subcommands)
- All I/O through TUIHandler (effect-cli-tui)
- No external CLI frameworks (validates Effect CLI + OpenTui pattern)
- Type-safe error handling with error types in Effect signature

#### 7.2 Update package.json

Add bin field to make the CLI executable:

```json
{
  "bin": {
    "create-effect-agent": "./dist/index.js"
  }
}
```

**Deliverables**:
- [ ] `index.ts` entry point with Effect CLI orchestration
- [ ] package.json updated with bin field

---

### Step 8: End-to-End Testing

**Goal**: Test the complete workflow.

**Tasks**:

#### 8.1 Create E2E Test

File: `packages/create-effect-agent/src/__tests__/e2e.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as Effect from 'effect/Effect'
import { generateProject } from '../commands/generate'

describe('create-effect-agent E2E', () => {
  let testDir: string

  beforeEach(async () => {
    testDir = path.join('/tmp', `test-project-${Date.now()}`)
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (err) {
      // Ignore cleanup errors
    }
  })

  it('should create a basic project', async () => {
    const config = {
      projectName: 'test-project',
      projectPath: testDir,
      template: 'basic' as const,
      agents: ['claude'],
      libraries: [],
      ideRules: ['vscode'],
      setupLinting: false,
      setupGit: false
    }

    const result = await Effect.runPromise(
      generateProject(config)
    )

    expect(result.name).toBe('test-project')
    expect(result.path).toBe(testDir)

    // Check generated files
    const files = await fs.readdir(testDir)
    expect(files).toContain('package.json')
    expect(files).toContain('tsconfig.json')
    expect(files).toContain('src')
  })
})
```

**Deliverables**:
- [ ] E2E test file created
- [ ] Test passes: `pnpm -F create-effect-agent test`

---

### Step 9: Documentation

**Goal**: Document the CLI for end users.

**Tasks**:

#### 9.1 Create CLI README

File: `packages/create-effect-agent/README.md`

```markdown
# create-effect-agent

Interactive CLI for bootstrapping agentic Effect projects.

## Installation

```bash
pnpm create effect-agent my-app
```

## Usage

```bash
create-effect-agent init [project-name]
```

This launches an interactive TUI that guides you through:

1. **Project Name** — Name of your project
2. **Template** — Choose basic, cli, or monorepo
3. **Agents** — Select Claude, Gemini, OpenAI support
4. **Libraries** — Optional ecosystem libraries
5. **IDE Rules** — Generate rules for Cursor, VS Code, Windsurf
6. **Linting** — Set up Ultracite formatting
7. **Git** — Initialize git repository

## Generated Project

Your project includes:

- ✓ TypeScript 5.9 + Effect 3.18 setup
- ✓ IDE rules for your chosen editors
- ✓ Agent instruction files (Claude.md, Gemini.md, Agents.md)
- ✓ pnpm + Turborepo configured (monorepo template)
- ✓ Ultracite linting/formatting
- ✓ Git initialized with first commit

## Next Steps

After creation:

```bash
cd my-app
pnpm install
pnpm dev
```

## Contributing

See [Contributing.md](../../CONTRIBUTING.md)
```

#### 9.2 Update Root README

Update with status of Phase 1b completion.

**Deliverables**:
- [ ] CLI README created
- [ ] Root README updated with Phase 1b status

---

### Phase 1b Completion Checklist

- [ ] Package structure created
- [ ] Commands implemented
  - [ ] `init.ts` with user prompts
  - [ ] `generate.ts` with project generation
- [ ] Templates created
  - [ ] Basic template
  - [ ] CLI template
  - [ ] Monorepo template
- [ ] IDE rules created
  - [ ] Cursor
  - [ ] VS Code
  - [ ] Windsurf
- [ ] Agent rules created
  - [ ] Claude.md
  - [ ] Gemini.md
  - [ ] Agents.md
- [ ] Utilities implemented
  - [ ] file.ts
  - [ ] template.ts
  - [ ] git.ts
  - [ ] linting.ts
- [ ] Entry point created (`index.ts`)
- [ ] E2E tests passing
- [ ] CLI README created
- [ ] Full workflow tested manually

**Gate**: All items checked ✓ → Phase 1 Complete

---

## Success Criteria (Phase 1 Overall)

✓ Users can run `pnpm create effect-agent my-app`  
✓ Interactive TUI guides through project configuration  
✓ Generated project has all necessary files and configs  
✓ IDE rules work in Cursor, VS Code, Windsurf  
✓ Agent instruction files present and correct  
✓ Ecosystem libraries installed  
✓ Git initialized (if selected)  
✓ Ultracite linting configured (if selected)  
✓ Project runs without errors  

---

## Known Unknowns & Future Work

### Known Unknowns
- Exact OpenTui API and integration patterns (validated in Phase 1a)
- Template variable substitution edge cases
- Effect CLI subprocess integration reliability

### Future Work (Phase 2+)
- Extract effect-cli-tui as independent library
- Add more templates (full-stack, library)
- Support project configuration files (.effect-agentrc)
- Automated template updates
- Plugin system for custom templates