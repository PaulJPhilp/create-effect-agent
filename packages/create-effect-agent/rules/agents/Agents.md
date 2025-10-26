# General Agent Guidance for {{projectName}}

This document provides guidance for any AI agent working on this Effect-TS project.

## Project Context

This is an Effect-TS application using functional programming patterns with strong static typing.

**Tech Stack:**
- Language: TypeScript 5.9 (strict mode)
- Runtime: Effect 3.18
- Package Manager: pnpm 9.x
- Testing: Vitest 1.x

## Key Principles

1. **Type Safety First**: Let TypeScript catch errors at compile time
2. **Effect Everything**: All side effects go through Effect runtime
3. **Explicit Errors**: Use custom TaggedError classes, avoid generic Error
4. **Pure Functions**: Keep business logic separate from effects
5. **Test Coverage**: Write tests for utilities and critical paths

## Common Tasks

### Adding a New Utility

1. Create `src/utils/newThing.ts`
2. Define error type in `src/types.ts` if needed
3. Implement function returning `Effect.Effect<T, Err>`
4. Create `src/__tests__/newThing.test.ts` with Vitest
5. Export from `src/index.ts`

### Adding a Command

1. Create `src/commands/newCommand.ts`
2. Implement command as `Effect.Effect<Result, Error>`
3. Use TUIHandler from effect-cli-tui for user interaction
4. Write integration tests in `src/__tests__/commands.test.ts`
5. Wire into CLI entry point when ready

### Fixing a Bug

1. Write a failing test that reproduces the bug
2. Implement fix in source
3. Verify test passes
4. Run full test suite: `pnpm test`
5. Check types compile: `pnpm build`

## Build & Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build TypeScript
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

## Directory Structure

```
packages/create-effect-agent/
  ├── src/
  │   ├── commands/        # CLI commands (init, generate)
  │   ├── utils/           # File, template, git, linting ops
  │   ├── types.ts         # All error & interface types
  │   ├── constants.ts     # Configuration constants
  │   └── index.ts         # CLI entry point
  ├── templates/           # Project templates
  │   ├── basic/
  │   ├── cli/
  │   └── monorepo/
  ├── rules/               # IDE & agent rules
  │   ├── cursor/
  │   ├── vscode/
  │   ├── windsurf/
  │   └── agents/
  └── __tests__/           # Test files
```

## Error Handling Pattern

Always define errors in `types.ts`:

```typescript
class MyError extends Data.TaggedError('MyError') {
  constructor(readonly reason: string) {
    super()
  }
}
```

Use in functions:

```typescript
Effect.fail(new MyError('something went wrong'))
```

Handle in pipelines:

```typescript
program.pipe(
  Effect.catchTag('MyError', (err) =>
    Effect.log(`Error: ${err.reason}`)
  )
)
```

## Testing

Use Vitest for all tests:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

Example test structure:

```typescript
import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { myFunction } from '../src/utils/myThing'

describe('myThing', () => {
  it('does something', () => {
    const result = Effect.runSync(myFunction())
    expect(result).toBeDefined()
  })

  it('handles errors', () => {
    expect(() =>
      Effect.runSync(myFunction())
    ).toThrow()
  })
})
```

## Before Committing

1. Run `pnpm test` - all tests pass
2. Run `pnpm build` - no TypeScript errors
3. Run `pnpm lint` - no linting errors
4. Format code with Prettier
5. Write clear commit messages

## Resources

- **Effect**: https://effect.website (patterns, API reference)
- **TypeScript**: https://www.typescriptlang.org/
- **Vitest**: https://vitest.dev/
- **pnpm**: https://pnpm.io/

---

When in doubt, check existing code in the same directory for patterns.
