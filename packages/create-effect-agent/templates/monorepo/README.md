# {{projectName}}

Monorepo Effect-TS project generated with create-effect-agent.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Build all packages
pnpm build

# Run development mode for all packages
pnpm dev
```

## Project Structure

```
packages/
  ├── cli/           # CLI application
  └── core/          # Core library
pnpm-workspace.yaml  # Workspace configuration
turbo.json          # Build pipeline configuration
```

## Scripts

- `pnpm build` - Build all packages with Turbo
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code in all packages
- `pnpm dev` - Run development mode for all packages

## Dependencies

- **effect** - Functional Effect runtime
- **typescript** - Type checking
- **turbo** - Build system for monorepos

## Development

This monorepo uses:
- **TypeScript 5.9** in strict mode
- **Effect 3.18** for functional composition
- **Turbo** for efficient builds
- **pnpm** for package management
- **Vitest** for testing
- **ESLint & Prettier** for code quality

## Adding New Packages

1. Create a new directory under `packages/`
2. Add `package.json` with proper name and dependencies
3. Update `pnpm-workspace.yaml` if needed
4. Run `pnpm install` to update workspace

## Resources

- [Effect Documentation](https://effect.website/)
- [Turbo Documentation](https://turbo.build/)
- [pnpm Documentation](https://pnpm.io/)