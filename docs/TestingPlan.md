Perfect. Now let me draft the final document: **TestingPlan.md**

---

# TestingPlan.md — create-effect-agent

## Overview

This document outlines the testing strategy for create-effect-agent across both Phase 1a (manual bootstrap) and Phase 1b (CLI automation).

**Testing Philosophy**: Test at each layer (unit, integration, end-to-end) to ensure reliability and catch issues early.

---

## Testing Strategy

### Three-Tier Testing Approach

1. **Unit Tests** — Individual functions and utilities
2. **Integration Tests** — Component interactions (CLI + TUI, file operations, etc.)
3. **End-to-End Tests** — Complete workflows (user runs CLI → project created)

---

## Phase 1a: Manual Bootstrap Testing

### Objective

Validate that the monorepo structure, tooling, and effect-cli-tui package work correctly.

### Test Coverage

#### 1. Monorepo Setup Tests

**Test**: Workspace Recognition

```bash
pnpm install
pnpm list
```
**Expected**: Both packages listed as workspace members
**Validation**: [ ] Passes

**Test**: Build Isolation

```bash
pnpm -F effect-cli-tui build
```
**Expected**: Builds successfully, outputs to `dist/`
**Validation**: [ ] Passes

#### 2. TypeScript Compilation Tests

**Test**: Type Checking

```bash
pnpm -F effect-cli-tui exec tsc --noEmit
```
**Expected**: No type errors
**Validation**: [ ] Passes

**Test**: Declaration Files

```bash
ls -la packages/effect-cli-tui/dist/
```
**Expected**: `.d.ts` files present alongside `.js` files
**Validation**: [ ] Passes

#### 3. effect-cli-tui Package Tests

**Unit Tests**: `packages/effect-cli-tui/src/__tests__/cli.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { EffectCLI, CLIError } from '../cli'

describe('EffectCLI', () => {
  const cli = new EffectCLI()

  describe('run()', () => {
    it('should execute Effect CLI version command', async () => {
      const result = await Effect.runPromise(
        cli.run('--version', [])
      )
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toBeTruthy()
    })

    it('should handle command failures', async () => {
      const result = Effect.runPromise(
        cli.run('invalid-command', [])
      )
      expect(result).rejects.toThrow(CLIError)
    })

    it('should capture stderr on failure', async () => {
      try {
        await Effect.runPromise(
          cli.run('invalid-command', [])
        )
      } catch (err) {
        expect(err.reason).toBe('CommandFailed')
        expect(err.message).toBeDefined()
      }
    })
  })

  describe('stream()', () => {
    it('should stream command output', async () => {
      const result = await Effect.runPromise(
        cli.stream('--version', [])
      )
      expect(result).toBeUndefined() // stream returns void
    })
  })
})
```

**Unit Tests**: `packages/effect-cli-tui/src/__tests__/tui.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { TUIHandler, TUIError } from '../tui'

describe('TUIHandler', () => {
  const tui = new TUIHandler()

  describe('selectOption()', () => {
    it('should return valid option value', async () => {
      const result = await Effect.runPromise(
        tui.selectOption('Choose one:', [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ])
      )
      expect(['opt1', 'opt2']).toContain(result)
    })

    it('should handle empty options', async () => {
      const result = Effect.runPromise(
        tui.selectOption('Choose:', [])
      )
      expect(result).rejects.toThrow()
    })
  })

  describe('prompt()', () => {
    it('should return user input', async () => {
      const result = await Effect.runPromise(
        tui.prompt('Enter name:', { default: 'test' })
      )
      expect(result).toBeTruthy()
    })

    it('should validate input', async () => {
      const result = Effect.runPromise(
        tui.prompt('Enter number:', {
          validate: (val) => !isNaN(Number(val)) || 'Must be a number'
        })
      )
      // Validation behavior depends on OpenTui integration
      expect(result).toBeDefined()
    })
  })

  describe('confirm()', () => {
    it('should return boolean', async () => {
      const result = await Effect.runPromise(
        tui.confirm('Continue?')
      )
      expect(typeof result).toBe('boolean')
    })
  })

  describe('multiSelect()', () => {
    it('should return array of selected values', async () => {
      const result = await Effect.runPromise(
        tui.multiSelect('Choose multiple:', [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' }
        ])
      )
      expect(Array.isArray(result)).toBe(true)
      result.forEach(val => expect(['a', 'b', 'c']).toContain(val))
    })
  })

  describe('display()', () => {
    it('should display success message', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      await Effect.runPromise(
        tui.display('Success!', 'success')
      )
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✓'))
      consoleSpy.mockRestore()
    })

    it('should display error message', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      await Effect.runPromise(
        tui.display('Error!', 'error')
      )
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✗'))
      consoleSpy.mockRestore()
    })
  })
})
```

**Integration Test**: `packages/effect-cli-tui/src/__tests__/integration.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { EffectCLI, TUIHandler } from '../index'

describe('effect-cli-tui Integration', () => {
  describe('CLI + TUI Together', () => {
    it('should collect config and validate CLI works', async () => {
      const cli = new EffectCLI()
      const tui = new TUIHandler()

      // Simulate user interaction
      const projectName = 'test-project'
      const template = 'basic'

      // Validate CLI command works
      const result = await Effect.runPromise(
        cli.run('--version', [])
      )
      expect(result.exitCode).toBe(0)

      // Validate TUI works
      const selected = await Effect.runPromise(
        tui.selectOption('Template:', [
          { label: 'Basic', value: 'basic' }
        ])
      )
      expect(selected).toBe('basic')
    })
  })
})
```

**Deliverables**:
- [ ] Unit tests for EffectCLI pass
- [ ] Unit tests for TUIHandler pass
- [ ] Integration tests pass
- [ ] Coverage > 80%

**Validation Commands**:
```bash
pnpm -F effect-cli-tui test
pnpm -F effect-cli-tui test -- --coverage
```

#### 4. Manual Smoke Tests

**Test**: Can import and use effect-cli-tui from create-effect-agent

```typescript
// In a test file
import { EffectCLI, TUIHandler } from 'effect-cli-tui'

const cli = new EffectCLI()
const tui = new TUIHandler()
```

**Expected**: Imports resolve correctly
**Validation**: [ ] Passes

### Phase 1a Test Checklist

- [ ] Monorepo setup validates (pnpm install, list)
- [ ] TypeScript compilation succeeds
- [ ] EffectCLI unit tests pass
- [ ] TUIHandler unit tests pass
- [ ] Integration tests pass
- [ ] Manual smoke test passes
- [ ] Test coverage > 80%

**Gate**: All checklist items ✓ → Proceed to Phase 1b

---

## Phase 1b: CLI Implementation Testing

### Objective
Validate that create-effect-agent CLI correctly generates projects with all configurations.

### Test Coverage

#### 1. Command Tests

**Unit Tests**: `packages/create-effect-agent/src/__tests__/commands.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as Effect from 'effect/Effect'
import { initProject } from '../commands/init'
import { ValidateError } from '../types'

describe('Commands', () => {
  describe('initProject()', () => {
    it('should reject reserved project names', async () => {
      // Mock TUI to return reserved name
      const result = Effect.runPromise(initProject)
      expect(result).rejects.toThrow(ValidateError)
    })

    it('should return valid CLIConfig', async () => {
      // Mock TUI with valid inputs
      const config = await Effect.runPromise(initProject)
      
      expect(config.projectName).toBeDefined()
      expect(config.template).toMatch(/basic|cli|monorepo/)
      expect(Array.isArray(config.agents)).toBe(true)
      expect(Array.isArray(config.libraries)).toBe(true)
      expect(Array.isArray(config.ideRules)).toBe(true)
      expect(typeof config.setupLinting).toBe('boolean')
      expect(typeof config.setupGit).toBe('boolean')
    })
  })
})
```

**Unit Tests**: `packages/create-effect-agent/src/__tests__/generate.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as Effect from 'effect/Effect'
import { generateProject } from '../commands/generate'

describe('generateProject()', () => {
  let testDir: string

  beforeEach(() => {
    testDir = path.join('/tmp', `test-${Date.now()}`)
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (err) {
      // Ignore
    }
  })

  it('should create project directory', async () => {
    const config = {
      projectName: 'test-app',
      projectPath: testDir,
      template: 'basic' as const,
      agents: ['claude'],
      libraries: [],
      ideRules: [],
      setupLinting: false,
      setupGit: false
    }

    const result = await Effect.runPromise(
      generateProject(config)
    )

    const exists = await fs.stat(testDir).then(() => true).catch(() => false)
    expect(exists).toBe(true)
  })

  it('should fail if directory exists', async () => {
    await fs.mkdir(testDir, { recursive: true })

    const config = {
      projectName: 'test-app',
      projectPath: testDir,
      template: 'basic' as const,
      agents: ['claude'],
      libraries: [],
      ideRules: [],
      setupLinting: false,
      setupGit: false
    }

    const result = Effect.runPromise(generateProject(config))
    expect(result).rejects.toThrow()
  })
})
```

#### 2. Template Tests

**Unit Tests**: `packages/create-effect-agent/src/__tests__/templates.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { processTemplate } from '../utils/template'
import * as Effect from 'effect/Effect'

describe('Template Processing', () => {
  describe('processTemplate()', () => {
    it('should replace variables', async () => {
      const template = 'Hello {{name}}, welcome to {{project}}'
      const variables = { name: 'Alice', project: 'Effect' }

      const result = await Effect.runPromise(
        processTemplate(template, variables)
      )

      expect(result).toBe('Hello Alice, welcome to Effect')
    })

    it('should handle missing variables', async () => {
      const template = 'Name: {{name}}'
      const variables = {}

      const result = await Effect.runPromise(
        processTemplate(template, variables)
      )

      expect(result).toBe('Name: {{name}}') // Unchanged
    })

    it('should handle multiple occurrences', async () => {
      const template = '{{name}} is {{name}}'
      const variables = { name: 'Bob' }

      const result = await Effect.runPromise(
        processTemplate(template, variables)
      )

      expect(result).toBe('Bob is Bob')
    })
  })
})
```

#### 3. File Operations Tests

**Unit Tests**: `packages/create-effect-agent/src/__tests__/file.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as Effect from 'effect/Effect'
import { createDirectory, copyFile } from '../utils/file'

describe('File Utilities', () => {
  let testDir: string

  beforeEach(() => {
    testDir = path.join('/tmp', `file-test-${Date.now()}`)
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (err) {
      // Ignore
    }
  })

  describe('createDirectory()', () => {
    it('should create directory', async () => {
      const target = path.join(testDir, 'newdir')
      await Effect.runPromise(createDirectory(target))

      const exists = await fs.stat(target).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })

    it('should create nested directories', async () => {
      const target = path.join(testDir, 'a', 'b', 'c')
      await Effect.runPromise(createDirectory(target))

      const exists = await fs.stat(target).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })
  })

  describe('copyFile()', () => {
    it('should copy file', async () => {
      await fs.mkdir(testDir, { recursive: true })
      const src = path.join(testDir, 'source.txt')
      const dest = path.join(testDir, 'dest.txt')

      await fs.writeFile(src, 'test content')
      await Effect.runPromise(copyFile(src, dest))

      const content = await fs.readFile(dest, 'utf-8')
      expect(content).toBe('test content')
    })
  })
})
```

#### 4. End-to-End Tests

**E2E Test**: `packages/create-effect-agent/src/__tests__/e2e.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as Effect from 'effect/Effect'
import { initProject } from '../commands/init'
import { generateProject } from '../commands/generate'

describe('E2E: Create Project Workflow', () => {
  let testDir: string

  beforeEach(() => {
    testDir = path.join('/tmp', `e2e-${Date.now()}`)
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (err) {
      // Ignore
    }
  })

  describe('Basic Template', () => {
    it('should create complete basic project', async () => {
      const config = {
        projectName: 'basic-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: ['vscode'],
        setupLinting: false,
        setupGit: false
      }

      const project = await Effect.runPromise(
        generateProject(config)
      )

      // Verify project structure
      expect(project.name).toBe('basic-app')
      expect(project.path).toBe(testDir)

      // Check essential files exist
      const files = [
        'package.json',
        'tsconfig.json',
        'src/index.ts',
        'ultracite.config.ts',
        '.gitignore'
      ]

      for (const file of files) {
        const filePath = path.join(testDir, file)
        const exists = await fs.stat(filePath).then(() => true).catch(() => false)
        expect(exists).toBe(true)
      }
    })

    it('should generate correct package.json', async () => {
      const config = {
        projectName: 'my-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: ['vscode'],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const packageJsonPath = path.join(testDir, 'package.json')
      const content = await fs.readFile(packageJsonPath, 'utf-8')
      const pkg = JSON.parse(content)

      expect(pkg.name).toBe('my-app')
      expect(pkg.dependencies.effect).toBeDefined()
      expect(pkg.devDependencies.typescript).toBeDefined()
    })

    it('should include VS Code rules', async () => {
      const config = {
        projectName: 'vscode-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: ['vscode'],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const vscodePath = path.join(testDir, '.vscode', 'settings.json')
      const exists = await fs.stat(vscodePath).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })

    it('should include agent rules', async () => {
      const config = {
        projectName: 'agent-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude', 'gemini'],
        libraries: [],
        ideRules: [],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const claudePath = path.join(testDir, 'Claude.md')
      const geminPath = path.join(testDir, 'Gemini.md')

      const claudeExists = await fs.stat(claudePath).then(() => true).catch(() => false)
      const geminExists = await fs.stat(geminPath).then(() => true).catch(() => false)

      expect(claudeExists).toBe(true)
      expect(geminExists).toBe(true)
    })
  })

  describe('CLI Template', () => {
    it('should create CLI project with correct structure', async () => {
      const config = {
        projectName: 'cli-app',
        projectPath: testDir,
        template: 'cli' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: [],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const files = ['package.json', 'tsconfig.json', 'src/cli.ts']
      for (const file of files) {
        const filePath = path.join(testDir, file)
        const exists = await fs.stat(filePath).then(() => true).catch(() => false)
        expect(exists).toBe(true)
      }
    })
  })

  describe('Monorepo Template', () => {
    it('should create monorepo with workspace config', async () => {
      const config = {
        projectName: 'mono-app',
        projectPath: testDir,
        template: 'monorepo' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: [],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const files = [
        'pnpm-workspace.yaml',
        'turbo.json',
        'package.json'
      ]

      for (const file of files) {
        const filePath = path.join(testDir, file)
        const exists = await fs.stat(filePath).then(() => true).catch(() => false)
        expect(exists).toBe(true)
      }
    })
  })

  describe('With Libraries', () => {
    it('should include specified ecosystem libraries', async () => {
      const config = {
        projectName: 'lib-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: ['effect-end', 'effect-mdx'],
        ideRules: [],
        setupLinting: false,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      const packageJsonPath = path.join(testDir, 'package.json')
      const content = await fs.readFile(packageJsonPath, 'utf-8')
      const pkg = JSON.parse(content)

      expect(pkg.dependencies['effect-end']).toBeDefined()
      expect(pkg.dependencies['effect-mdx']).toBeDefined()
    })
  })

  describe('With Git', () => {
    it('should initialize git repository', async () => {
      const config = {
        projectName: 'git-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: [],
        setupLinting: false,
        setupGit: true
      }

      await Effect.runPromise(generateProject(config))

      const gitDir = path.join(testDir, '.git')
      const exists = await fs.stat(gitDir).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })
  })

  describe('With Linting', () => {
    it('should run Ultracite formatting', async () => {
      const config = {
        projectName: 'lint-app',
        projectPath: testDir,
        template: 'basic' as const,
        agents: ['claude'],
        libraries: [],
        ideRules: [],
        setupLinting: true,
        setupGit: false
      }

      await Effect.runPromise(generateProject(config))

      // Verify files are formatted (check for consistent formatting markers)
      const srcPath = path.join(testDir, 'src', 'index.ts')
      const content = await fs.readFile(srcPath, 'utf-8')
      
      // Ultracite should have formatted the file
      expect(content).toBeDefined()
    })
  })
})
```

**Deliverables**:
- [ ] Unit tests for commands pass
- [ ] Unit tests for templates pass
- [ ] Unit tests for file operations pass
- [ ] E2E tests pass for all templates
- [ ] E2E tests pass for optional features (git, linting, libraries)
- [ ] Coverage > 80%

**Validation Commands**:
```bash
pnpm -F create-effect-agent test
pnpm -F create-effect-agent test -- --coverage
```

#### 5. Manual Acceptance Tests

**Test**: User runs CLI interactively

```bash
pnpm -F create-effect-agent build
node dist/index.js
```

**Expected**:
1. Welcome message displays
2. Project name prompt appears
3. User can select template, agents, libraries, IDE rules
4. User can confirm linting and git setup
5. Project is created at specified location
6. All files are present and valid
7. Success message displays

**Validation**: [ ] Manual test passes

**Test**: Generated project is functional

```bash
cd generated-project
pnpm install
pnpm build
pnpm test
```

**Expected**:
- Dependencies install
- Project compiles without errors
- Tests run (even if no tests defined)

**Validation**: [ ] Manual test passes

### Phase 1b Test Checklist

- [ ] Command unit tests pass
- [ ] Template unit tests pass
- [ ] File operations unit tests pass
- [ ] E2E tests pass (all templates)
- [ ] E2E tests pass (with libraries)
- [ ] E2E tests pass (with git)
- [ ] E2E tests pass (with linting)
- [ ] Manual interactive test passes
- [ ] Generated project builds and runs
- [ ] Test coverage > 80%

**Gate**: All checklist items ✓ → Phase 1 Complete

---

## Continuous Testing

### Pre-Commit

```bash
pnpm lint
pnpm format
pnpm test
```

### CI/CD (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: pnpm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Coverage Goals

| Metric | Target | Phase 1a | Phase 1b |
|--------|--------|----------|----------|
| Line Coverage | > 80% | [ ] | [ ] |
| Branch Coverage | > 75% | [ ] | [ ] |
| Function Coverage | > 80% | [ ] | [ ] |
| Statement Coverage | > 80% | [ ] | [ ] |

---

## Test Maintenance

### Adding New Tests

When adding features:
1. Write unit test first
2. Run `pnpm test` to verify it fails
3. Implement feature
4. Run `pnpm test` to verify it passes
5. Add integration test if needed
6. Update E2E test if user-facing

### Debugging Failed Tests

```bash
# Run single test file
pnpm test file.test.ts

# Run with verbose output
pnpm test -- --reporter=verbose

# Update snapshots (if using snapshots)
pnpm test -- --update
```

---

## Known Issues & Workarounds

### Issue: OpenTui Integration Not Testable
**Workaround**: Mock TUI in tests, validate with manual acceptance tests

### Issue: File System Operations in Tests
**Workaround**: Use temporary directories (`/tmp`), clean up in afterEach

### Issue: Subprocess Timeouts
**Workaround**: Set generous timeouts in tests, use `timeout` option in CLI wrapper

---

## Testing Checklist (End-of-Phase-1)

### Phase 1a
- [ ] All monorepo setup tests pass
- [ ] effect-cli-tui unit tests > 80% coverage
- [ ] Integration tests pass
- [ ] Manual smoke tests pass
- [ ] CI/CD pipeline running

### Phase 1b
- [ ] All command tests pass
- [ ] All template tests pass
- [ ] All file operation tests pass
- [ ] E2E tests cover all workflows
- [ ] Manual acceptance tests pass
- [ ] Generated projects build and run
- [ ] CI/CD pipeline passing
- [ ] Coverage > 80%

**Final Gate**: All tests passing ✓ → Phase 1 Release Ready

---

This TestingPlan provides comprehensive coverage for both phases and ensures create-effect-agent is reliable and maintainable.