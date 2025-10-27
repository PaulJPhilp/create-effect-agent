# Agent Guidelines for create-effect-agent

## Build/Lint/Test Commands

- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier
- Single test: `cd packages/create-effect-agent && pnpm test path/to/test.ts`

## Architecture

Monorepo using Turbo with one main package:
- `packages/create-effect-agent/` - CLI tool for bootstrapping Effect-TS projects
- Tech stack: TypeScript 5.9 (strict), Effect 3.18, Vitest, pnpm 9.x
- No databases; CLI tool with project templates

## Code Style Guidelines

- **TypeScript**: Strict mode, strong static typing
- **Effects**: All side effects through Effect runtime
- **Errors**: Custom TaggedError classes, no generic Error
- **Imports**: Standard TypeScript imports
- **Naming**: camelCase functions, PascalCase classes/types
- **Formatting**: Prettier with default settings

See `packages/create-effect-agent/rules/agents/` for detailed agent instructions (Agents.md, Claude.md, Gemini.md).
