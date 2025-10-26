# create-effect-agent

Bootstrap agentic Effect projects with pre-configured rules, ecosystem libraries, and agent support.

A CLI tool that automates the setup of Effect-TS projects optimized for agentic coding, featuring interactive guided configuration, pre-built project templates, and IDE/agent integration.

## Project Status

### Phase 1a ✅ Complete

- [x] Monorepo structure established (pnpm workspaces + Turborepo)
- [x] `effect-cli-tui` package implemented and tested
  - Effect CLI wrapper for subprocess execution
  - Interactive prompt handler using @inquirer/prompts
  - Full Effect-native error handling
- [x] Integration tests passing
- [x] Build system working (TypeScript + Turbo)
- [x] Documentation comprehensive

### Phase 1b 🚧 In Progress

- [x] `create-effect-agent` CLI implementation (Effect-native, no Commander.js)
- [x] Project templates (basic, CLI, monorepo) with README files
- [x] IDE and agent rule files (Cursor, VS Code, Windsurf)
- [x] Entry point using Effect CLI exclusively
- [x] Init workflow complete with validation
- [ ] **Generate workflow implementation** — Create actual project files on disk
- [ ] **End-to-end workflow testing** — Full user journey tests
- [ ] **Build and test validation** — Verify generated projects build and test correctly
- [ ] **Linting and formatting** — Ultracite integration for generated projects

## Project Structure

```
create-effect-agent/                     # Monorepo root
├── packages/
│   ├── effect-cli-tui/                 # Reusable Effect CLI + TUI wrapper
│   │   ├── src/
│   │   │   ├── cli.ts                  # Effect CLI wrapper
│   │   │   ├── tui.ts                  # Interactive prompt handler (@inquirer/prompts)
│   │   │   ├── types.ts                # Shared types, error definitions
│   │   │   ├── effects/                # Effect wrapper implementations
│   │   │   ├── components/             # Ink React components (future: v2 TUI)
│   │   │   └── index.ts                # Public API
│   │   ├── __tests__/
│   │   │   ├── integration.test.ts     # Effect CLI + TUI integration tests
│   │   │   ├── ink/                    # Ink component tests (PoC)
│   │   ├── vitest.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── create-effect-agent/             # CLI tool for project generation
│       ├── src/
│       │   ├── index.ts                # Entry point (orchestrates workflow)
│       │   ├── commands/               # CLI commands
│       │   │   ├── init.ts             # Collect project configuration interactively
│       │   │   └── generate.ts         # Create project files, init git, run linting
│       │   ├── templates/              # Project templates
│       │   │   ├── basic/              # Minimal Effect project
│       │   │   │   ├── package.json
│       │   │   │   ├── tsconfig.json
│       │   │   │   ├── README.md
│       │   │   │   └── src/index.ts
│       │   │   ├── cli/                # CLI application template
│       │   │   │   ├── package.json
│       │   │   │   ├── tsconfig.json
│       │   │   │   └── src/index.ts
│       │   │   └── monorepo/           # Monorepo template (pnpm + Turbo)
│       │   │       ├── package.json
│       │   │       ├── pnpm-workspace.yaml
│       │   │       ├── turbo.json
│       │   │       ├── tsconfig.json
│       │   │       ├── README.md
│       │   │       └── packages/{cli,core}/
│       │   ├── rules/                  # IDE and agent configuration templates
│       │   │   ├── cursor/
│       │   │   │   └── .cursor/rules.md
│       │   │   ├── vscode/
│       │   │   │   └── .vscode/settings.json
│       │   │   ├── windsurf/
│       │   │   │   └── .windsurf/rules.md
│       │   │   └── agents/
│       │   │       ├── Agents.md       # General agent patterns
│       │   │       ├── Claude.md       # Claude-specific guidance
│       │   │       └── Gemini.md       # Gemini-specific guidance
│       │   ├── utils/                  # Helper utilities
│       │   │   ├── file.ts             # File I/O operations
│       │   │   ├── template.ts         # Template variable substitution
│       │   │   ├── git.ts              # Git repository initialization
│       │   │   └── linting.ts          # Ultracite linting integration
│       │   ├── constants.ts            # Project name validation, library metadata
│       │   ├── types.ts                # CLI-specific types and error classes
│       │   └── __tests__/
│       │       └── integration.test.ts # End-to-end workflow tests
│       ├── vitest.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── docs/
│   ├── PRD.md                          # Product requirements and goals
│   ├── Architecture.md                 # System design and component details
│   ├── ImplementationPlan.md           # Phase-by-phase implementation roadmap
│   ├── TestingPlan.md                  # Test strategy and coverage goals
│   └── archived/
│       └── opentui-exploration/        # Past TUI framework evaluation
│
├── pnpm-workspace.yaml                 # pnpm workspace configuration
├── turbo.json                          # Turborepo build orchestration
├── tsconfig.json                       # Shared TypeScript configuration
├── package.json                        # Root monorepo package
├── pnpm-lock.yaml                      # Dependency lock file
└── README.md                           # This file
```

## Quick Start

### For End Users (Coming Soon)

Once published to npm, create projects with:

```bash
# Create a new basic Effect project
npm init effect-agent my-effect-app

# Create a CLI tool
npm init effect-agent my-cli-tool --template cli

# Create a monorepo
npm init effect-agent my-monorepo --template monorepo
```

The interactive CLI will guide you through:
- 📦 Project naming and validation
- 📋 Template selection (basic, CLI, monorepo)
- 🤖 Agent selection (Claude, Gemini, OpenAI)
- 📚 Ecosystem library selection
- 🎨 IDE rule integration (Cursor, VS Code, Windsurf)
- 🔧 Optional linting and git setup

### For Developers

#### Prerequisites

- **Node.js:** 20+ LTS
- **pnpm:** 9.x+
- **TypeScript:** 5.9+ (auto-installed)

#### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/create-effect-agent
cd create-effect-agent

# Install dependencies (includes all workspaces)
pnpm install

# Build both packages
pnpm build

# Run all tests
pnpm test

# Format code with Prettier
pnpm format
```

#### Development Workflow

```bash
# Build with watch mode
pnpm build -- --watch

# Run tests for a specific package
cd packages/effect-cli-tui
pnpm test

# Run linting on source files
pnpm lint

# Run CLI locally (development)
node packages/create-effect-agent/dist/index.js init my-test-project
```

#### Project Commands

All commands use Turborepo for parallel execution across workspaces:

| Command | Description |
|---------|-------------|
| `pnpm build` | Compile TypeScript → dist/ |
| `pnpm test` | Run all unit and integration tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Run ESLint on src/ |
| `pnpm format` | Format with Prettier |
| `pnpm clean` | Remove dist/ and node_modules/ |

## Core Features

### 1. Interactive CLI Configuration

Guided prompts using @inquirer/prompts for intuitive setup:

- **Project Naming:** Validates against npm package naming conventions
- **Template Selection:** Choose from Basic, CLI, or Monorepo templates
- **Agent Selection:** Optionally include Claude, Gemini, or OpenAI guidance
- **Library Selection:** Pre-select ecosystem libraries (effect-end, effect-mdx, effect-regex, etc.)
- **IDE Rules:** Include Cursor, VS Code, or Windsurf-specific rules
- **Git & Linting:** Optional initialization and formatting

### 2. Pre-Built Project Templates

Three production-ready templates included:

#### Basic Template
Minimal Effect project for learning and experimentation.
```
my-effect-app/
├── src/index.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

#### CLI Template
Full Effect CLI application with command structure and error handling.
```
my-cli-tool/
├── src/
│   ├── index.ts
│   ├── commands/
│   └── utils/
├── package.json
└── ...
```

#### Monorepo Template
Enterprise-ready pnpm + Turborepo setup with shared packages.
```
my-monorepo/
├── packages/
│   ├── cli/
│   ├── core/
│   └── shared/
├── pnpm-workspace.yaml
├── turbo.json
└── ...
```

### 3. IDE and Agent Integration

**Automatic IDE Rules:**
- **Cursor:** .cursor/rules.md with Effect patterns and best practices
- **VS Code:** .vscode/settings.json with recommended extensions and formatting
- **Windsurf:** .windsurf/rules.md with agentic coding guidance

**Agent Instruction Files:**
- **Agents.md:** Universal patterns for all agents
- **Claude.md:** Claude-specific tips and reasoning strategies
- **Gemini.md:** Gemini-specific capabilities and limitations

### 4. Ecosystem Library Integration

Pre-configured libraries automatically included (customizable):
- **effect** — Core runtime
- **effect-end** — Stream operations
- **effect-mdx** — Markdown processing
- **effect-regex** — Regular expression utilities
- **effect-html** — HTML parsing and generation

### 5. Build System Integration

All generated projects include:
- **TypeScript 5.9:** Strict mode, latest features
- **Effect Runtime:** Type-safe error handling and composition
- **Turborepo** (monorepos only): Parallel builds and task caching
- **pnpm:** Efficient dependency management

---

## Architecture Overview

### Layered Design

```
┌─────────────────────────────────────────────┐
│      create-effect-agent (CLI Tool)        │
│  • init: Collect project configuration     │
│  • generate: Create files from templates   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     effect-cli-tui (Reusable Layer)        │
│  • TUIHandler: Interactive prompts         │
│  • EffectCLI: Effect CLI wrapper           │
│  • Types: Shared errors and interfaces     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│    External Dependencies                   │
│  • effect: Core runtime                    │
│  • @inquirer/prompts: Interactive CLI      │
│  • fs, path, child_process: Node APIs      │
└──────────────────────────────────────────────┘
```

### Key Modules

#### effect-cli-tui Package
Reusable wrapper providing Effect-based CLI and interactive prompts.

**Exports:**
```typescript
export class TUIHandler {
  prompt(message: string, options?): Effect<string, TUIError>
  selectOption(message: string, options[]): Effect<string, TUIError>
  multiSelect(message: string, options[]): Effect<string[], TUIError>
  confirm(message: string): Effect<boolean, TUIError>
  display(message: string, level: 'info'|'success'|'error'): Effect<void, TUIError>
}

export class EffectCLI {
  run(command: string, args?: string[]): Effect<CLIResult, CLIError>
  runSync(command: string, args?: string[]): CLIResult | CLIError
}

export type CLIConfig = {
  projectName: string
  projectPath: string
  template: 'basic' | 'cli' | 'monorepo'
  agents: string[]
  libraries: string[]
  ideRules: string[]
  setupLinting: boolean
  setupGit: boolean
}
```

#### create-effect-agent Package
CLI tool orchestrating the full workflow.

**Workflow:**
1. `init` — Collects configuration interactively
2. `generate` — Creates project structure and files
3. Returns success/error feedback to user

---

## Technology Stack

### Runtime & Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Effect** | ^3.18.0 | Core runtime, type-safe error handling |
| **TypeScript** | ^5.9.0 | Strict type checking, modern language features |
| **Node.js** | 20+ LTS | Runtime environment |

### CLI & Interaction

| Technology | Version | Purpose |
|-----------|---------|---------|
| **@inquirer/prompts** | ^5.0.0 | Interactive CLI prompts (current) |
| **ora** | ^8.0.0 | Progress spinners and status messages |

### Build & Monorepo

| Technology | Version | Purpose |
|-----------|---------|---------|
| **pnpm** | 9.x+ | Efficient monorepo package manager |
| **Turborepo** | ^2.0.0 | Monorepo build orchestration and caching |

### Testing

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vitest** | ^1.0.0 | Unit and integration testing |
| **@vitest/ui** | ^1.0.0 | Test result visualization |

### Development Tools

| Technology | Version | Purpose |
|-----------|---------|---------|
| **TypeScript** | ^5.9.0 | Compilation and type checking |
| **ESLint** | ^8.0.0 | Linting and code quality |
| **Prettier** | ^3.0.0 | Code formatting |

### Future Considerations

- **Ink + React:** Advanced TUI components (v2+)
- **zod:** Schema validation for configs
- **chalk:** Colored terminal output

---

### Test Coverage

#### Unit Tests

Test individual utilities and functions in isolation.

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Watch mode
pnpm test:watch
```

**Example Test Coverage:**
- `utils/file.ts` — File creation and copying
- `utils/template.ts` — Variable substitution
- `utils/git.ts` — Git repository initialization
- `utils/linting.ts` — Ultracite integration

#### Integration Tests

Test component interactions: CLI + TUI, file system operations, subprocess calls.

Located in: `packages/*/src/__tests__/integration.test.ts`

```typescript
// Example: Init workflow
test('init workflow collects configuration', async () => {
  const config = await Effect.runPromise(initProject)
  expect(config.projectName).toBeDefined()
  expect(config.template).toMatch(/basic|cli|monorepo/)
})

// Example: Generate workflow  
test('generate workflow creates project files', async () => {
  const project = await Effect.runPromise(
    generateProject(mockConfig)
  )
  expect(fs.existsSync(project.path)).toBe(true)
  expect(fs.existsSync(`${project.path}/package.json`)).toBe(true)
})
```

#### End-to-End Tests

Test complete user workflows from CLI invocation to project generation.

```bash
# Run E2E tests
pnpm test -- e2e

# Example: User creates a monorepo project
test('user creates and builds monorepo project', async () => {
  // 1. Run CLI with inputs
  // 2. Verify project structure
  // 3. Run pnpm install
  // 4. Run pnpm build
  // 5. Verify build output
})
```

### Current Test Status

- ✅ effect-cli-tui integration tests passing
- ✅ CLI initialization workflow validated
- 🚧 Generate workflow tests in progress
- 🚧 Project build validation pending
- 🚧 E2E workflow tests pending

## Documentation

Comprehensive documentation for understanding and contributing:

| Document | Purpose |
|----------|---------|
| **[PRD.md](./docs/PRD.md)** | Product vision, goals, success criteria, user stories |
| **[Architecture.md](./docs/Architecture.md)** | System design, component architecture, data flows, interfaces |
| **[ImplementationPlan.md](./docs/ImplementationPlan.md)** | Phase-by-phase implementation roadmap with detailed steps |
| **[TestingPlan.md](./docs/TestingPlan.md)** | Test strategy, coverage goals, test cases for each phase |
| **Package READMEs** | Development guidelines for individual packages |

## Outstanding Tasks & Next Steps

### Phase 1b: CLI Automation (Current)

#### Completed ✅
- [x] CLI entry point (index.ts) with Effect orchestration
- [x] Init workflow with interactive configuration
- [x] Project templates (basic, CLI, monorepo)
- [x] IDE rule files and agent guidance files
- [x] Type definitions and error handling
- [x] Project name validation

#### In Progress 🚧

1. **Generate Workflow Implementation** *(Priority: HIGH)*
   - [ ] Validate project path doesn't exist
   - [ ] Create directory structure
   - [ ] Apply template files with variable substitution
   - [ ] Copy IDE rule files
   - [ ] Copy agent guidance files
   - [ ] Add ecosystem library dependencies to package.json
   - [ ] Create .gitignore from template
   - [ ] Implementation: `packages/create-effect-agent/src/commands/generate.ts`
   - Related utilities: `src/utils/{file.ts, template.ts, git.ts}`

2. **File Operation Utilities** *(Priority: HIGH)*
   - [ ] `file.ts` — copyTemplate, createDirectory, writeFile, readTemplate
   - [ ] `template.ts` — substituteVariables, loadTemplate
   - [ ] `git.ts` — initRepository, addFiles, createInitialCommit
   - [ ] All functions should return Effect types for composition

3. **End-to-End Workflow Testing** *(Priority: HIGH)*
   - [ ] Create integration tests that run full user journey
   - [ ] Test each project template (basic, CLI, monorepo)
   - [ ] Verify generated projects build successfully
   - [ ] Verify TypeScript compilation with no errors
   - [ ] Verify tests run successfully in generated projects
   - [ ] Location: `packages/create-effect-agent/src/__tests__/integration.test.ts`

4. **Generated Project Validation** *(Priority: MEDIUM)*
   - [ ] Verify package.json is valid JSON
   - [ ] Verify tsconfig.json is valid JSON
   - [ ] Verify TypeScript compilation
   - [ ] Verify npm dependencies can be installed
   - [ ] Verify src/index.ts compiles correctly

5. **Linting and Formatting** *(Priority: MEDIUM)*
   - [ ] Integrate Ultracite for generated projects
   - [ ] Run formatting on generated files
   - [ ] Validate linting rules in IDE rules files
   - [ ] Implementation: `src/utils/linting.ts`

6. **Error Handling & Recovery** *(Priority: MEDIUM)*
   - [ ] Handle EEXIST errors when project directory exists
   - [ ] Handle EACCES errors for permission issues
   - [ ] Provide helpful error messages and recovery suggestions
   - [ ] Implement rollback on partial failures
   - [ ] Better error types in `src/types.ts`

7. **CLI Help & Documentation** *(Priority: LOW)*
   - [ ] Add `--help` output
   - [ ] Add `--version` output
   - [ ] Add command examples in help text
   - [ ] Create user-facing documentation

### Phase 2: Future Expansion

- [ ] effect-supermemory integration (project memory management)
- [ ] code-skill integration (agent coding capabilities)
- [ ] Advanced TUI with Ink + React (optional v2 feature)
- [ ] Additional templates (Next.js, Remix, Fastify integrations)
- [ ] Plugin system for custom templates
- [ ] Integration with Effect Patterns website

### Known Limitations & Considerations

- ✋ **@inquirer/prompts:** Limited to basic prompts; Ink (v2+) needed for advanced UI
- 📦 **Template Variables:** Currently supports basic substitution; consider extending
- 🔗 **pnpm Dependency:** Projects generated with monorepo template require pnpm
- ⚙️ **Node Version:** Requires Node 20+; document this clearly for users
- 🚀 **Npm Publishing:** Package not yet published; configuration ready (package.json#bin)

---

## Performance Considerations

### Build Speed
- Turborepo enables parallel builds and caching across workspaces
- Incremental builds only rebuild changed packages
- Expected build time: <5 seconds for development, <30 seconds for CI

### Template Generation
- File operations batched to minimize disk I/O
- Parallel file copying where possible using Effect.all()
- Expected project creation time: 2-5 seconds (excluding npm install)

### Memory Usage
- Effect programs are lazy-evaluated; memory proportional to operation complexity
- No unnecessary buffering of template files
- Streaming used for large file operations

---

## Contributing

### Development Workflow

1. **Fork and clone** the repository
2. **Install dependencies:** `pnpm install`
3. **Create feature branch:** `git checkout -b feature/your-feature`
4. **Make changes** with tests
5. **Run validation:** `pnpm build && pnpm test && pnpm lint`
6. **Commit with conventional commits:** `git commit -m "feat: description"`
7. **Push and open PR**

### Code Style

- **TypeScript:** Strict mode, no `any` types
- **Formatting:** Prettier (automatic on save)
- **Linting:** ESLint with @effect/eslint-plugin rules
- **Tests:** Vitest with >80% coverage target

### Before Submitting PR

- [ ] Tests passing: `pnpm test`
- [ ] No type errors: `pnpm build`
- [ ] Linting passes: `pnpm lint`
- [ ] Code formatted: `pnpm format`
- [ ] Commits follow conventional format
- [ ] PR description explains changes

### Running CLI Locally

```bash
# Build the package
pnpm build

# Run locally
node packages/create-effect-agent/dist/index.js init my-test-app

# Or for development/debugging
cd packages/create-effect-agent
npm run build
node dist/index.js init my-test-app
```

---

## Troubleshooting

### Common Issues

#### **Build Fails: "Cannot find module 'effect'"**
```bash
# Reinstall dependencies
pnpm install
pnpm build
```

#### **Tests Fail: "Port already in use"**
Tests using subprocess operations may conflict. Kill existing processes:
```bash
pkill -f "node.*dist"
pnpm test
```

#### **CLI Doesn't Respond to Prompts**
Ensure stdin is properly connected:
```bash
# Direct execution (stdin attached)
node dist/index.js init my-app

# Via npm script (stdin may be detached)
npm run start
```

#### **Generated Project Won't Install**
Ensure pnpm is installed globally:
```bash
npm install -g pnpm@9
pnpm --version  # Verify 9.x
```

---

## License

MIT

## Contact & Support

For issues, questions, or contributions:

- **GitHub Issues:** Report bugs and request features
- **Discussions:** Ask questions and share ideas
- **Contributing:** See the [Contributing](#contributing) section below

---
