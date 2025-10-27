# test-lib

A minimal Effect-TS library.

## Installation

```bash
npm install
```

## Usage

```typescript
import { greet, main, Effect } from 'test-lib'

// Run the example program
Effect.runSync(main)

// Or use the greet function
const result = Effect.runSync(greet('World'))
console.log(result) // "Hello, World! Welcome to test-lib."
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build the library
npm run build

# Type check
npm run typecheck

# Format code
npm run format
```
