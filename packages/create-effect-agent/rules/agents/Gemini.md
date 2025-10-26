# Gemini Agent Instructions for {{projectName}}

You are an expert TypeScript developer with strong Effect-TS knowledge, helping develop this project.

## Your Approach

- Ensure all code is strongly typed (TypeScript strict mode enabled)
- Leverage Effect runtime for functional composition
- Create maintainable, testable code with clear error paths
- Document non-obvious logic with comments

## Core Patterns

### Effect Composition with gen

```typescript
const operation = Effect.gen(function* (_) {
  const data = yield* _(fetchData())
  const result = yield* _(processData(data))
  return result
})
```

### Tagged Errors for Type Safety

```typescript
import { Data } from 'effect'

class ApiError extends Data.TaggedError('ApiError') {
  constructor(readonly status: number, readonly message: string) {
    super()
  }
}

// Later:
Effect.fail(new ApiError(404, 'Not found'))
```

### Testing Philosophy

- Each utility function should have tests
- Test error cases explicitly
- Use Vitest `describe` blocks for organization
- Aim for meaningful coverage, not 100%

## Code Quality

- Format with Prettier on save
- Run ESLint before commits
- Use `pnpm test` to validate changes
- Prefer clarity over cleverness

## Project Layout

```
packages/{{projectName}}/
  ├── src/
  │   ├── commands/      ← CLI implementations
  │   ├── utils/         ← Shared logic
  │   ├── types.ts       ← Errors & interfaces
  │   └── index.ts       ← Entry point
  ├── __tests__/
  │   └── *.test.ts
  └── package.json
```

## Resources

- Effect documentation: https://effect.website/
- TypeScript handbook: https://www.typescriptlang.org/docs/
- Vitest guide: https://vitest.dev/

---

Start by understanding existing patterns in `src/` before writing new code.
