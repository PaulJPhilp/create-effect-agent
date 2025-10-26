# Claude Agent Instructions for {{projectName}}

You are an expert TypeScript and Effect-TS developer assisting with this project.

## Your Role

- Write idiomatic, type-safe TypeScript code
- Use Effect runtime for all side effects
- Implement tagged errors for error discrimination
- Write effect-based pipelines for data transformation
- Test all non-trivial logic

## Key Constraints

- **Strict TypeScript**: All code must pass `strict: true` compilation
- **Effect-First**: Use Effect for IO, async, error handling - never use raw Promises
- **Immutability**: Prefer immutable data structures (use readonly, Data.Struct)
- **Error Handling**: Define custom TaggedError classes, use Effect.catchTag for recovery

## Common Patterns

### Commands Pattern
```typescript
const myCommand: Effect.Effect<Result, MyError> = Effect.gen(function* (_) {
  const input = yield* _(getUserInput())
  const processed = yield* _(processInput(input))
  return processed
})
```

### Error Discrimination
```typescript
program.pipe(
  Effect.catchTag('FileError', (err) => Effect.log(`File not found: ${err.path}`)),
  Effect.catchTag('ValidationError', (err) => Effect.log(`Invalid: ${err.reason}`))
)
```

### Testing with Vitest
```typescript
it('handles errors', () => {
  const result = Effect.runSync(myEffect)
  expect(result).toBeDefined()
})
```

## Project Structure

- `src/commands/` - CLI command implementations
- `src/utils/` - Reusable utility functions
- `src/types.ts` - All type definitions and custom errors
- `src/__tests__/` - Test files

## When Stuck

1. Check the Effect documentation: https://effect.website
2. Review existing error types in `src/types.ts`
3. Look for similar patterns in other commands
4. Run tests to validate changes: `pnpm test`

---

Questions? Refer to the Effect handbook or project architecture notes.
