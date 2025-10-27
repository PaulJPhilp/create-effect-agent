# {{projectName}}

Effect-TS project generated with create-effect-agent.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run the application
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Project Structure

```
src/
  ├── index.ts       # Entry point
  └── types.ts       # Type definitions
```

## Scripts

- `pnpm dev` - Run in development mode
- `pnpm build` - Build TypeScript
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Check code with ESLint
- `pnpm format` - Format code with Prettier

## Dependencies

- **effect** - Functional Effect runtime
- **typescript** - Type checking

## Supermemory Quickstart

This template includes an example of how to integrate with `effect-supermemory`.

1.  **Set your Supermemory API Key:**

    Create a `.env` file in the root of your project and add your Supermemory API key:

    ```
    SUPERMEMORY_API_KEY=your_supermemory_api_key_here
    ```

    **Note:** For security, never commit your actual API key to version control. Use environment variables.

2.  **Run the example:**

    The `src/supermemory/example.ts` file contains an `exampleSupermemoryEffect` that demonstrates basic wiring with retries. You can run it as part of your application.

    ```typescript
    import { exampleSupermemoryEffect, Effect } from './src'

    Effect.runPromise(exampleSupermemoryEffect("Hello Supermemory"))
    ```

    The included test (`test/supermemory.example.test.ts`) provides an offline-safe example of how to test your Supermemory integration by mocking the service.

## Development

This project uses:
- **TypeScript 5.9** in strict mode
- **Effect 3.18** for functional composition
- **Vitest** for testing
- **ESLint & Prettier** for code quality

## Resources

- [Effect Documentation](https://effect.website)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

Generated with ❤️ by create-effect-agent
