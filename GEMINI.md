# Gemini Code Assistant Context

## Project Overview

This project, `create-effect-agent`, is a command-line interface (CLI) tool designed to bootstrap and scaffold projects using the Effect-TS ecosystem. It facilitates the creation of new Effect-TS applications with pre-configured settings, project structures, and integrations for agent-driven development environments like Gemini, Claude, and Cursor.

The project is structured as a pnpm monorepo, utilizing Turborepo for efficient build and task orchestration.

### Key Technologies
- **Core Framework:** Effect-TS
- **Language:** TypeScript
- **Runtime:** Node.js (>=20)
- **Package Manager:** pnpm (workspaces)
- **Monorepo Tool:** Turborepo
- **Testing:** Vitest

### Project Structure

The monorepo contains the main CLI package:

-   `packages/create-effect-agent`: The primary CLI tool that contains the logic for interactive project generation, template creation, and rule application.

It includes templates for different project types:
-   **Basic:** A minimal Effect-TS project.
-   **CLI:** A template for building command-line tools with Effect-TS.
-   **Monorepo:** A template for setting up a larger project with multiple packages.

## Building and Running

### Prerequisites
- Node.js v20+
- pnpm v9+

### Key Commands

The following commands are run from the root of the repository and are managed by Turborepo.

-   **Install Dependencies:**
    ```bash
    pnpm install
    ```

-   **Build Project:** Compiles all TypeScript packages.
    ```bash
    pnpm build
    ```

-   **Run Tests:** Executes the test suite for all packages using Vitest.
    ```bash
    pnpm test
    ```

-   **Linting:** Runs ESLint across the codebase.
    ```bash
    pnpm lint
    ```

-   **Formatting:** Formats the code using Prettier.
    ```bash
    pnpm format
    ```

### Running the CLI Locally

To run the `create-effect-agent` CLI for development purposes:

1.  Build the project: `pnpm build`
2.  Execute the CLI:
    ```bash
    node packages/create-effect-agent/dist/index.js <command> [options]
    ```
    *Example:*
    ```bash
    node packages/create-effect-agent/dist/index.js generate ./my-test-lib --name my-test-lib --yes
    ```

## Development Conventions

-   **Code Style:** The project follows standard TypeScript best practices with a strict configuration. Formatting is enforced by Prettier and linting by ESLint with ` @effect/eslint-plugin`.
-   **Commit Messages:** Conventional Commits are likely used (inferred from `CONTRIBUTING.md` references, though the file is not present).
-   **Error Handling:** The project extensively uses Effect-TS for robust, type-safe error handling.
-   **Testing:** Unit and integration tests are written with Vitest. The goal is to maintain high test coverage. End-to-end tests are also part of the testing strategy.
