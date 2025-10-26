# effect-cli-tui

Reusable Effect CLI wrapper with interactive prompts supporting both @inquirer (traditional) and Ink (React-based) TUI components.

## Features

- **@inquirer/prompts Integration** - Traditional CLI prompts with proven stability
- **Ink Integration** - React-based terminal UI for complex workflows
- **Effect Integration** - Functional error handling and composition
- **Multi-screen Workflows** - Build complex interactive CLIs with form flows
- **Backward Compatible** - Use both prompting libraries together
- **TypeScript Support** - Full type safety and IDE support

## Installation

```bash
pnpm add effect-cli-tui
```

## Quick Start

### Traditional Prompts (@inquirer)

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler } from 'effect-cli-tui'

const main = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  const name = yield* _(
    tui.prompt('What is your name?')
  )
  
  const confirmed = yield* _(
    tui.confirm(`Hello ${name}, is this correct?`)
  )
  
  return confirmed
})

Effect.runPromise(main)
```

### Modern Ink-based UI

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler } from 'effect-cli-tui'

const main = Effect.gen(function* (_) {
  const tui = new InkTUIHandler()
  
  const choice = yield* _(
    tui.selectOption('Choose an option', [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ])
  )
  
  return choice
})

Effect.runPromise(main)
```

### Multi-screen Form (Ink)

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler, InputScreen, SelectScreen } from 'effect-cli-tui'
import React from 'react'

const main = Effect.gen(function* (_) {
  const tui = new InkTUIHandler()
  
  const result = yield* _(
    tui.formFlow({
      screens: [
        {
          id: 'name',
          title: 'Enter Name',
          component: ({ onNext }) =>
            React.createElement(InputScreen, {
              title: 'Step 1',
              prompt: 'Name:',
              onNext,
            }),
        },
        {
          id: 'role',
          title: 'Select Role',
          component: ({ onNext }) =>
            React.createElement(SelectScreen, {
              title: 'Step 2',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ],
              onNext,
            }),
        },
      ],
    })
  )
  
  return result
})

Effect.runPromise(main)
```

## API

### TUIHandler (@inquirer)

- `prompt(message, options?)` - Text input
- `selectOption(message, options)` - Select from list
- `multiSelect(message, options)` - Select multiple
- `confirm(message)` - Yes/no confirmation

### InkTUIHandler (Ink/React)

- `inputPrompt(prompt, defaultValue?, validate?)` - Text input with validation
- `selectOption(message, options)` - Rich select with descriptions
- `confirm(message, title?)` - Styled confirmation
- `formFlow(config)` - Multi-screen workflows with state management

## Documentation

- **[INK_INTEGRATION_GUIDE.md](./INK_INTEGRATION_GUIDE.md)** - Complete Ink usage guide
- **[INK_EXAMPLES.md](./INK_EXAMPLES.md)** - Real-world examples

## When to Use Each

### Use @inquirer When:
- Building simple single-prompt CLIs
- Need minimal dependencies
- Want proven, battle-tested prompts
- Compatibility is paramount

### Use Ink When:
- Building multi-screen workflows
- Need to preserve context across prompts
- Want interactive dashboards or rich UIs
- Building complex CLIs with navigation

### Use Both:
```typescript
import { TUIHandler, InkTUIHandler } from 'effect-cli-tui'

const inquirerTUI = new TUIHandler()
const inkTUI = new InkTUIHandler()

// Use each for their strengths
```

## Error Handling

All methods return `Effect<T, TUIError>` or `Effect<T, InkError>`.

```typescript
const effect = tui.selectOption(...).pipe(
  Effect.catchTag('InkError', (err) => {
    console.error('Failed to render:', err.message)
    return Effect.succeed('default')
  })
)
```

## Dependencies

- `effect` - Functional programming framework
- `@inquirer/prompts` - Traditional CLI prompts
- `ink` - React renderer for terminal (Ink features only)
- `react` - React library (Ink features only)
- `ink-text-input` - Text input component for Ink (Ink features only)

## Compatibility

- **Node.js** - 18+
- **TypeScript** - 5.0+
- **Effect** - 3.18+

## Examples

See [INK_EXAMPLES.md](./INK_EXAMPLES.md) for:
- Simple select
- Multi-screen forms
- Dashboards
- Error handling
- Custom components
- Real-world project setup CLI

## Contributing

Contributions welcome! Please ensure:
- All tests pass: `pnpm test`
- Code builds: `pnpm build`
- No TypeScript errors
- Documentation is updated

## Related Packages

- **effect** - Core functional programming framework
- **@inquirer/prompts** - Traditional CLI prompts
- **ink** - React for the terminal
- **create-effect-agent** - Full project generator using effect-cli-tui

## License

MIT
