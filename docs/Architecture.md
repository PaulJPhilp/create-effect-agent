Absolutely. Here's the complete updated **Architecture.md**:

---

# Architecture.md — create-effect-agent

## System Overview

```
create-effect-agent (Monorepo)
├── packages/
│   ├── effect-cli-tui/          # Reusable Effect CLI + OpenTui integration
│   │   ├── src/
│   │   │   ├── index.ts         # Main exports
│   │   │   ├── cli.ts           # Effect CLI wrapper
│   │   │   ├── tui.ts           # OpenTui integration
│   │   ├── types.ts             # Shared types
│   │   │   └── handlers/        # Command handlers
│   │   └── package.json
│   │
│   └── create-effect-agent/     # CLI tool
│       ├── src/
│       │   ├── index.ts         # Entry point
│       │   ├── commands/        # TUI-driven commands
│       │   │   ├── init.ts      # Project initialization + config collection
│       │   │   ├── configure.ts # Interactive configuration
│       │   │   └── generate.ts  # Template generation + git init + linting
│       │   ├── templates/       # Pre-configured templates
│       │   │   ├── basic/
│       │   │   │   ├── package.json.template
│       │   │   │   ├── tsconfig.json.template
│       │   │   │   ├── .eslintrc.template
│       │   │   │   ├── ultracite.config.ts
│       │   │   │   └── src/
│       │   │   ├── monorepo/
│       │   │   │   ├── pnpm-workspace.yaml
│       │   │   │   ├── turbo.json
│       │   │   │   └── ultracite.config.ts
│       │   │   └── shared/      # Shared configs
│       │   │       ├── .gitignore
│       │   │       └── effect.config.ts
│       │   ├── rules/           # IDE and agent rules
│       │   │   ├── cursor/
│       │   │   │   └── .cursor/rules.md
│       │   │   ├── vscode/
│       │   │   │   └── .vscode/settings.json
│       │   │   ├── windsurf/
│       │   │   │   └── .windsurf/rules.md
│       │   │   └── agents/      # Agent instruction files
│       │   │       ├── Claude.md
│       │   │       ├── Gemini.md
│       │   │       └── Agents.md
│       │   ├── types.ts         # CLI-specific types
│       │   ├── utils/           # Utilities
│       │   │   ├── file.ts      # File operations
│       │   │   ├── template.ts  # Template processing
│       │   │   ├── git.ts       # Git operations
│       │   │   └── linting.ts   # Ultracite operations
│       │   └── constants.ts     # Configuration constants
│       └── package.json
└── docs/
    ├── PRD.md
    ├── Architecture.md
    ├── ImplementationPlan.md
    └── TestingPlan.md
```

## Component Architecture

### 1. effect-cli-tui Package

**Purpose**: Reusable wrapper around Effect CLI with OpenTui integration for interactive prompts. This layer provides the foundation for agentic CLI interactions and is designed to be extracted as a standalone library.

**Key Modules:**

#### `cli.ts` — Effect CLI Wrapper

Wraps the Effect CLI for programmatic use within Effect programs.

```typescript
export interface CLIRunOptions {
  cwd?: string
  env?: Record<string, string>
  timeout?: number
}

export interface CLIResult {
  exitCode: number
  stdout: string
  stderr: string
}

export class EffectCLI {
  /**
   * Run an Effect CLI command
   * @param command Effect CLI command (e.g., "new", "build")
   * @param args Command arguments
   * @param options Execution options
   * @returns Effect that yields CLIResult or CLIError
   */
  run(
    command: string, 
    args: string[], 
    options?: CLIRunOptions
  ): Effect.Effect<CLIResult, CLIError>

  /**
   * Stream Effect CLI output in real-time
   */
  stream(
    command: string, 
    args: string[], 
    options?: CLIRunOptions
  ): Effect.Effect<void, CLIError>
}

export class CLIError extends Data.TaggedError('CLIError') {
  readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound'
}
```

#### `tui.ts` — OpenTui Integration

Provides interactive prompts via OpenTui, returning Effect-based results.

```typescript
export interface SelectOption {
  label: string
  value: string
  description?: string
}

export interface PromptOptions {
  default?: string
  validate?: (input: string) => boolean | string
}

export class TUIHandler {
  /**
   * Show a select prompt with options
   */
  selectOption(
    message: string, 
    options: SelectOption[]
  ): Effect.Effect<string, TUIError>

  /**
   * Show a text input prompt
   */
  prompt(
    message: string, 
    options?: PromptOptions
  ): Effect.Effect<string, TUIError>

  /**
   * Show a yes/no confirmation
   */
  confirm(message: string): Effect.Effect<boolean, TUIError>

  /**
   * Show a multi-select (return array)
   */
  multiSelect(
    message: string, 
    options: SelectOption[]
  ): Effect.Effect<string[], TUIError>

  /**
   * Display info/success/error messages
   */
  display(message: string, type: 'info' | 'success' | 'error'): Effect.Effect<void>
}

export class TUIError extends Data.TaggedError('TUIError') {
  readonly reason: 'Cancelled' | 'ValidationFailed' | 'RenderError'
}
```

#### `types.ts` — Shared Types

```typescript
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

export type TemplateType = 'basic' | 'cli' | 'monorepo'
export type Agent = 'claude' | 'gemini' | 'openai'
export type IDE = 'cursor' | 'vscode' | 'windsurf'
export type Library = 'effect-end' | 'effect-mdx' | 'effect-regex'
```

**Exports**: Public API that other packages use to interact with Effect CLI + TUI together.

### 2. create-effect-agent Package

**Purpose**: CLI tool that uses effect-cli-tui to bootstrap agentic Effect projects with all necessary configurations, rules, and dependencies.

**Key Modules:**

#### `commands/init.ts` — Project Initialization

Collects user configuration via interactive TUI prompts.

```typescript
export const initProject: Effect.Effect<CLIConfig, InitError> = 
  Effect.gen(function*(_) {
    const projectName = yield* _(
      TUIHandler.prompt("Project name:")
    )
    
    const template = yield* _(
      TUIHandler.selectOption("Select template:", [
        { label: "Basic", value: "basic" },
        { label: "CLI", value: "cli" },
        { label: "Monorepo", value: "monorepo" }
      ])
    )
    
    const agents = yield* _(
      TUIHandler.multiSelect("Select agents:", [
        { label: "Claude", value: "claude" },
        { label: "Gemini", value: "gemini" },
        { label: "OpenAI", value: "openai" }
      ])
    )
    
    const libraries = yield* _(
      TUIHandler.multiSelect("Select ecosystem libraries:", [
        { label: "effect-end", value: "effect-end" },
        { label: "effect-mdx", value: "effect-mdx" },
        { label: "effect-regex", value: "effect-regex" }
      ])
    )
    
    const ideRules = yield* _(
      TUIHandler.multiSelect("Select IDE rules:", [
        { label: "Cursor", value: "cursor" },
        { label: "VS Code", value: "vscode" },
        { label: "Windsurf", value: "windsurf" }
      ])
    )
    
    const setupLinting = yield* _(
      TUIHandler.confirm("Set up linting and formatting with Ultracite?")
    )
    
    const setupGit = yield* _(
      TUIHandler.confirm("Initialize git repository?")
    )
    
    // Validate and return config
    return yield* _(validateConfig({
      projectName,
      template,
      agents,
      libraries,
      ideRules,
      setupLinting,
      setupGit,
      projectPath: `./${projectName}`
    }))
  })
```

#### `commands/configure.ts` — Advanced Configuration

Guides users through optional advanced settings (team defaults, package registry, etc.).

#### `commands/generate.ts` — Project Generation

Orchestrates template application, rule injection, git initialization, and linting setup.

```typescript
export const generateProject = (
  config: CLIConfig
): Effect.Effect<GeneratedProject, GenerateError> =>
  Effect.gen(function*(_) {
    // 1. Validate project path doesn't exist
    yield* _(validateProjectPath(config.projectPath))
    
    // 2. Create directory structure
    yield* _(FileUtils.createDirectory(config.projectPath))
    
    // 3. Apply template
    const template = yield* _(loadTemplate(config.template))
    yield* _(applyTemplate(config.projectPath, template, config))
    
    // 4. Copy and customize IDE rules
    for (const ide of config.ideRules) {
      yield* _(copyIDERules(config.projectPath, ide, config))
    }
    
    // 5. Copy and customize agent rules
    yield* _(copyAgentRules(config.projectPath, config.agents, config))
    
    // 6. Install ecosystem libraries
    yield* _(installLibraries(config.projectPath, config.libraries))
    
    // 7. Initialize git (optional)
    if (config.setupGit) {
      yield* _(GitUtils.init(config.projectPath))
      yield* _(GitUtils.addAll(config.projectPath))
      yield* _(GitUtils.commit(config.projectPath, "Initial commit"))
    }
    
    // 8. Run Ultracite setup (optional)
    if (config.setupLinting) {
      yield* _(LintingUtils.runUltracite(config.projectPath))
    }
    
    // 9. Display completion summary
    yield* _(TUIHandler.display(
      `Project created at ${config.projectPath}`,
      'success'
    ))
    
    return {
      name: config.projectName,
      path: config.projectPath,
      config,
      generatedAt: new Date()
    }
  })
```

#### `templates/` — Pre-configured Templates

Each template includes:

- `package.json.template` — Dependencies (effect, typescript, etc.)
- `tsconfig.json.template` — TypeScript configuration
- `ultracite.config.ts` — Linting/formatting rules
- `src/index.ts` — Starter code
- `.gitignore` — Git configuration

Templates use **variable substitution** (e.g., `{{projectName}}`):

```json
{
  "name": "{{projectName}}",
  "version": "0.0.1"
}
```

**Template Structure:**

```
templates/
├── basic/                     # Simple single-package project
├── cli/                       # CLI application template
├── monorepo/                  # pnpm workspace monorepo
└── shared/                    # Shared files for all templates
    ├── .gitignore
    ├── effect.config.ts
    └── README.md.template
```

#### `rules/` — IDE and Agent Rules

**Cursor Rules** (`rules/cursor/.cursor/rules.md`)

- Effect patterns and best practices
- Project-specific guidelines

**VS Code Settings** (`rules/vscode/.vscode/settings.json`)

- Extension recommendations
- Editor settings for Effect development

**Windsurf Rules** (`rules/windsurf/.windsurf/rules.md`)

- Similar to Cursor rules

**Agent Rules** (`rules/agents/`)

- `Claude.md` — Instructions for Claude
- `Gemini.md` — Instructions for Gemini
- `Agents.md` — General agent guidance

All rule files support **variable substitution** for project-specific customization.

#### `utils/` — Helper Utilities

**`file.ts`** — File system operations

```typescript
export const createDirectory = (path: string): Effect.Effect<void, FileError>
export const copyFile = (src: string, dest: string): Effect.Effect<void, FileError>
export const copyDirectory = (src: string, dest: string): Effect.Effect<void, FileError>
export const processTemplate = (
  content: string, 
  variables: Record<string, string>
): Effect.Effect<string, TemplateError>
```

**`template.ts`** — Template loading and processing

```typescript
export interface Template {
  name: string
  description: string
  files: TemplateFile[]
  variables: Record<string, VariableDefinition>
}

export const loadTemplate = (name: string): Effect.Effect<Template, TemplateError>
export const applyTemplate = (
  targetPath: string, 
  template: Template, 
  variables: Record<string, string>
): Effect.Effect<void, TemplateError>
```

**`git.ts`** — Git operations

```typescript
export const init = (path: string): Effect.Effect<void, GitError>
export const addAll = (path: string): Effect.Effect<void, GitError>
export const commit = (path: string, message: string): Effect.Effect<void, GitError>
```

**`linting.ts`** — Ultracite setup

```typescript
export const runUltracite = (
  path: string, 
  options?: UltraciteOptions
): Effect.Effect<void, LintingError>
```

#### `types.ts` — CLI-Specific Types

```typescript
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

export class InitError extends Data.TaggedError('InitError') {}
export class GenerateError extends Data.TaggedError('GenerateError') {}
export class ValidateError extends Data.TaggedError('ValidateError') {}
```

#### `index.ts` — Entry Point

**Purpose**: Single unified Effect program orchestrating the complete workflow.

All I/O flows through `TUIHandler` from `effect-cli-tui`. No external CLI frameworks (Commander.js) — pure Effect.

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
  })

// Execute the main program
Effect.runPromise(main).catch((err) => {
  console.error('✗ Error:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
```

**Design Principles:**

- Single command: No subcommands or CLI options
- TUIHandler for all user interactions (no console.log except errors)
- Effect.gen() for readable async flow
- Type-safe error handling with effect-cli-tui integration
- No external CLI frameworks (validates Effect CLI + OpenTui pattern)

## Data Flow

### Complete User Journey

```
User: pnpm create effect-agent

↓

create-effect-agent/index.ts (entry point)

↓

main() invokes Effect.runPromise(initProject)

↓

initProject (commands/init.ts):
  - TUIHandler.prompt("Project name?")
  - TUIHandler.selectOption("Select template")
  - TUIHandler.multiSelect("Select agents")
  - TUIHandler.multiSelect("Select libraries")
  - TUIHandler.multiSelect("Select IDE rules")
  - TUIHandler.confirm("Setup linting?")
  - TUIHandler.confirm("Setup git?")
  - validateConfig()

↓

generateProject(config) (commands/generate.ts):
  - validateProjectPath()
  - FileUtils.createDirectory()
  - applyTemplate()
    - Load template files
    - Substitute variables
    - Write to disk
  - copyIDERules()
  - copyAgentRules()
  - installLibraries() [pnpm install]
  - (optional) GitUtils.init/add/commit()
  - (optional) LintingUtils.runUltracite()
  - TUIHandler.display("✓ Project created")

↓

Project created at ./{{projectName}} with all configs ready
```

### Effect-TS Program Structure (Conceptual)

```typescript
const createAgentProject: Effect.Effect<GeneratedProject, AppError> =
  Effect.gen(function*(_) {
    // Collect configuration interactively
    const config = yield* _(initProject)
    
    // Validate
    const validated = yield* _(validateConfig(config))
    
    // Generate project
    const project = yield* _(generateProject(validated))
    
    // Return result
    return project
  })
```

## Integration Points

### Effect CLI Integration

- **Pattern**: Wrapping (not forking)
- **Implementation**: Spawn Effect CLI as subprocess via `child_process`
- **Communication**: Capture stdout/stderr
- **Error Handling**: Parse exit codes and stderr for meaningful errors
- **Future**: If Effect CLI adds programmatic API, migrate to that

### OpenTui Integration

- **Pattern**: Use OpenTui templates for guided interactive prompts
- **Implementation**: Call OpenTui React components via CLI rendering
- **Input Validation**: Validate user selections before proceeding
- **Display**: Show progress indicators and final summaries

### Ultracite Integration

- **Pattern**: Run as subprocess after project generation
- **Implementation**: `ultracite` CLI command in generated project directory
- **Configuration**: `ultracite.config.ts` baked into templates
- **Optional**: Only runs if user confirms during init

### Git Integration

- **Pattern**: Simple subprocess calls
- **Implementation**: `git init`, `git add`, `git commit`
- **Optional**: Only runs if user confirms during init

## Type System

### Core Types (effect-cli-tui)

```typescript
// From effect-cli-tui/src/types.ts
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

export type TemplateType = 'basic' | 'cli' | 'monorepo'
export type Agent = 'claude' | 'gemini' | 'openai'
export type IDE = 'cursor' | 'vscode' | 'windsurf'
export type Library = 'effect-end' | 'effect-mdx' | 'effect-regex'

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
```

### Extended Types (create-effect-agent)

```typescript
// From create-effect-agent/src/types.ts
export interface GeneratedProject {
  name: string
  path: string
  config: CLIConfig
  generatedAt: Date
}

export interface Template {
  name: string
  description: string
  files: TemplateFile[]
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

// Error types
export class InitError extends Data.TaggedError('InitError') {
  constructor(readonly message: string) { super() }
}

export class GenerateError extends Data.TaggedError('GenerateError') {
  constructor(readonly message: string) { super() }
}

export class ValidateError extends Data.TaggedError('ValidateError') {
  constructor(readonly message: string) { super() }
}
```

## Error Handling Strategy

All errors are represented as Effect.Effect failures:

**Validation Errors** (at collection phase)

- Invalid project name (empty, reserved keywords)
- Invalid template selection
- Path already exists

**Generation Errors** (at creation phase)

- File system errors (permission denied, disk full)
- Template file not found
- Subprocess failures (pnpm, git, ultracite)
- Variable substitution errors

All errors include:

- Clear error message
- Context (which step failed)
- Suggestion for recovery

Example:

```typescript
export class GenerateError extends Data.TaggedError('GenerateError') {
  constructor(
    readonly message: string,
    readonly step: 'template' | 'rules' | 'install' | 'git' | 'lint',
    readonly context?: Record<string, unknown>
  ) { super() }
}
```

## Dependency Management

### effect-cli-tui/package.json

```json
{
  "dependencies": {
    "effect": "^3.18.0",
    "opentui": "latest"
  },
  "devDependencies": {
    "typescript": "^5.9.0"
  }
}
```

### create-effect-agent/package.json

```json
{
  "dependencies": {
    "effect": "^3.18.0",
    "effect-cli-tui": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.0"
  }
}
```

## Monorepo Structure Rationale

**Why monorepo?**

1. **Separation of Concerns**: effect-cli-tui is a reusable abstraction; create-effect-agent depends on it
2. **Independent Development**: Both packages can be developed/tested in parallel
3. **Reusability**: Other projects can depend on effect-cli-tui without create-effect-agent
4. **Future Publication**: When effect-cli-tui is stable, it can be published to npm independently
5. **Shared Tooling**: Both use same tsconfig, build tools, linting (Ultracite), testing framework

**Workspace Configuration** (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'packages/*'
```

**Turborepo Tasks** (`turbo.json`)

- `build`: Compile TypeScript
- `test`: Run tests
- `lint`: Check code quality
- `format`: Format code with Ultracite

## Phase 1a: Manual Bootstrap

**Objectives:**

1. Manually set up monorepo structure following Effect best practices
2. Configure pnpm workspaces and Turborepo
3. Set up TypeScript + Effect tooling
4. Build effect-cli-tui package in isolation
5. Validate Effect CLI + OpenTui integration
6. Document all manual steps

**Deliverables:**

- Working monorepo with proper structure
- effect-cli-tui package (untested, but integrated)
- Documentation of manual setup (becomes Phase 1b blueprint)
- Integration test validating Effect CLI + OpenTui

**Why manual first?**

- Hands-on experience informs automation
- Discovers pain points and edge cases
- Validates all dependencies work together
- Creates blueprint for automation

## Phase 1b: create-effect-agent CLI

**Objectives:**

1. Build create-effect-agent CLI on top of effect-cli-tui
2. Implement interactive templates and rule generation
3. Implement git and linting integration
4. Test full workflow (CLI → TUI → project generation)

**Deliverables:**

- Working create-effect-agent CLI
- Generated projects with all configurations
- End-to-end integration tests
- README and usage documentation

---

**Is this complete and accurate? Ready for ImplementationPlan.md?**
