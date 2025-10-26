# Ink Integration Guide for effect-cli-tui

## Overview

This guide explains how to use Ink-based TUI components in `effect-cli-tui` to build rich, multi-screen terminal interfaces.

## What is Ink?

Ink is a React renderer for terminal applications. It lets you build interactive CLI UIs using React components, making it natural to handle state, components, and composition.

## Quick Start

### 1. Import the Handler

```typescript
import { InkTUIHandler } from 'effect-cli-tui'

const tui = new InkTUIHandler()
```

### 2. Basic Select

```typescript
import * as Effect from 'effect/Effect'

const effect = Effect.gen(function* (_) {
  const choice = yield* _(
    tui.selectOption('Choose an option', [
      { label: 'Option A', value: 'a', description: 'First choice' },
      { label: 'Option B', value: 'b', description: 'Second choice' },
    ])
  )
  console.log('You selected:', choice)
})

Effect.runPromise(effect)
```

### 3. Basic Input

```typescript
const effect = Effect.gen(function* (_) {
  const name = yield* _(
    tui.inputPrompt('Enter your name', '', (v) => 
      v.length > 0 || 'Name is required'
    )
  )
  console.log('Hello,', name)
})

Effect.runPromise(effect)
```

### 4. Confirmation

```typescript
const effect = Effect.gen(function* (_) {
  const confirmed = yield* _(
    tui.confirm('Are you sure?', 'Confirm Action')
  )
  if (confirmed) {
    console.log('Confirmed!')
  } else {
    console.log('Cancelled')
  }
})

Effect.runPromise(effect)
```

## Multi-Screen Forms

The most powerful feature is `formFlow` - it lets you build multi-screen workflows with shared context.

### Example: User Setup Flow

```typescript
import { SelectScreen, InputScreen, ConfirmScreen, FormFlow } from 'effect-cli-tui'
import React from 'react'

const effect = Effect.gen(function* (_) {
  const result = yield* _(
    tui.formFlow<UserSetup>({
      title: 'User Setup',
      screens: [
        {
          id: 'name',
          title: 'Enter Your Name',
          component: ({ onNext, onPrevious }) =>
            React.createElement(InputScreen, {
              title: 'Personal Information',
              prompt: 'Full name:',
              validate: (v) => v.length > 0 || 'Name required',
              onNext,
              onPrevious,
            }),
        },
        {
          id: 'email',
          title: 'Enter Your Email',
          component: ({ onNext, onPrevious }) =>
            React.createElement(InputScreen, {
              title: 'Personal Information',
              prompt: 'Email:',
              validate: (v) => v.includes('@') || 'Valid email required',
              onNext,
              onPrevious,
            }),
        },
        {
          id: 'role',
          title: 'Choose Your Role',
          component: ({ onNext, onPrevious }) =>
            React.createElement(SelectScreen, {
              title: 'User Role',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Guest', value: 'guest' },
              ],
              onNext,
              onPrevious,
            }),
        },
        {
          id: 'confirm',
          title: 'Confirm',
          component: ({ onNext, onPrevious }) =>
            React.createElement(ConfirmScreen, {
              title: 'Review',
              message: 'Create account with these details?',
              onConfirm: () => onNext(true),
              onCancel: () => onNext(false),
            }),
        },
      ],
      onComplete: (data) => {
        console.log('User setup complete:', data)
      },
    })
  )
  return result
})

Effect.runPromise(effect)
```

The form flow automatically:
- Maintains state across screens
- Accumulates data from each screen
- Allows backward navigation (Esc key)
- Passes all collected data to `onComplete`

## Creating Custom Screens

You can create custom screen components:

```typescript
import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { useInput } from 'ink'

interface CustomScreenProps {
  onNext: (value: string) => void
  onPrevious?: () => void
}

function MyCustomScreen({ onNext, onPrevious }: CustomScreenProps) {
  const [value, setValue] = useState('')

  useInput((input, key) => {
    if (input === 'y') {
      onNext('yes')
    }
    if (input === 'n') {
      onNext('no')
    }
  })

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Text bold color="cyan">Custom Screen</Text>
      <Text>Press 'y' for yes, 'n' for no</Text>
    </Box>
  )
}

// Use in formFlow
const screens: FormScreen[] = [
  {
    id: 'custom',
    title: 'My Custom Screen',
    component: MyCustomScreen,
  },
]
```

## InkTUIHandler Methods

### selectOption

Select from a list of options.

```typescript
selectOption<T>(
  message: string,
  options: Array<{
    label: string
    value: T
    description?: string
  }>
): Effect.Effect<T, InkError>
```

**Navigation:**
- ↑↓ - Navigate options
- Enter - Select option
- Esc - Go back (if onPrevious provided)

### inputPrompt

Get text input from user.

```typescript
inputPrompt(
  prompt: string,
  defaultValue?: string,
  validate?: (value: string) => boolean | string
): Effect.Effect<string, InkError>
```

**Validation:**
- Return `true` for valid input
- Return error message string for invalid input

### confirm

Get yes/no confirmation.

```typescript
confirm(
  message: string,
  title?: string
): Effect.Effect<boolean, InkError>
```

**Navigation:**
- ← → - Navigate yes/no
- Enter - Confirm selection

### formFlow

Multi-screen workflow with state management.

```typescript
formFlow<T>(
  config: FormFlowConfig<T>
): Effect.Effect<T, InkError>
```

**Config:**
- `title` - Optional flow title
- `screens` - Array of screen configurations
- `onComplete` - Called when flow finishes

## Error Handling

All methods return `Effect<T, InkError>`. Handle errors with Effect:

```typescript
const effect = Effect.gen(function* (_) {
  try {
    const choice = yield* _(tui.selectOption('Choose', options))
    return choice
  } catch (err) {
    if (err instanceof InkError) {
      console.error('Ink error:', err.reason, err.message)
    }
    throw err
  }
})
```

Or use Effect combinators:

```typescript
const effect = tui.selectOption('Choose', options).pipe(
  Effect.catchTag('InkError', (err) => {
    console.error('Failed to render:', err.message)
    return Effect.succeed('default')
  })
)
```

## When to Use Ink vs @inquirer

### Use Ink When:
- Building multi-screen workflows
- Need to preserve context across prompts
- Building interactive dashboards
- Want rich terminal UIs with custom layout
- Need real-time updates

### Use @inquirer When:
- Building simple single-prompt CLIs
- Minimizing dependencies
- Want proven, stable prompts
- Don't need complex navigation

### Both Together:
You can use both `TUIHandler` (@inquirer) and `InkTUIHandler` (Ink) in the same application:

```typescript
import { TUIHandler, InkTUIHandler } from 'effect-cli-tui'

const inquirerTUI = new TUIHandler()
const inkTUI = new InkTUIHandler()

// Use @inquirer for simple prompts
const name = yield* _(inquirerTUI.prompt('Your name'))

// Use Ink for complex workflows
const result = yield* _(
  inkTUI.formFlow({
    screens: [...],
  })
)
```

## Performance Considerations

- Ink renders efficiently - only terminal changes are output
- Components re-render on state changes
- Suitable for real-time updates and dashboards
- Terminal size changes are handled automatically

## Keyboard Shortcuts

### Global
- `Ctrl+C` - Exit (breaks Effect)

### SelectScreen
- `↑` / `↓` - Navigate
- `Enter` - Select
- `Esc` - Back (if available)

### InputScreen
- Regular text input
- `Enter` - Submit
- `Ctrl+C` - Cancel

### ConfirmScreen
- `←` / `→` - Navigate
- `Enter` - Confirm

### FormFlow
- Combines all above for each screen
- Esc goes to previous screen
- Can't go before first screen

## Examples

See `/packages/effect-cli-tui/src/examples/` for complete working examples:

1. **simple-select.tsx** - Basic select component usage
2. **form-flow.tsx** - Multi-screen form workflow
3. **dashboard.tsx** - Real-time dashboard example

## Troubleshooting

### Component doesn't render
- Check React element is created correctly
- Ensure onComplete callback is provided
- Check for TypeScript errors

### Keyboard input not working
- Make sure useInput hook is called
- Check isActive prop if conditional
- Ensure component is actually rendered

### Terminal output looks wrong
- Check terminal size
- Verify Ink version compatibility
- Try resizing terminal

## Migration from @inquirer

If moving from @inquirer/prompts:

```typescript
// Old @inquirer approach
const name = await prompt('Enter name')

// New Ink approach in Effect
const name = yield* _(tui.inputPrompt('Enter name'))

// Multi-step workflow (hard with @inquirer)
const result = yield* _(
  tui.formFlow({
    screens: [
      { id: 'name', component: NameScreen },
      { id: 'email', component: EmailScreen },
    ],
  })
)
```

## API Reference

### Types

```typescript
// Error type
class InkError extends TaggedError<'InkError'> {
  constructor(reason: string, message: string)
}

// Screen configuration
interface FormScreen<T> {
  id: string
  title: string
  component: React.ComponentType<{
    onNext: (value: T) => void
    onPrevious?: () => void
  }>
  validate?: (value: T) => boolean | string
}

// Flow configuration
interface FormFlowConfig<T> {
  title?: string
  screens: FormScreen<any>[]
  onComplete?: (result: T) => void
}

// Component props
interface SelectScreenProps<T> {
  title: string
  options: Array<{
    label: string
    value: T
    description?: string
  }>
  onNext: (value: T) => void
  onPrevious?: () => void
}

interface InputScreenProps {
  title: string
  prompt: string
  defaultValue?: string
  validate?: (value: string) => boolean | string
  onNext: (value: string) => void
  onPrevious?: () => void
}

interface ConfirmScreenProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}
```

## Related Documentation

- [Effect Documentation](https://effect.website/)
- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [React Documentation](https://react.dev/)
- [effect-cli-tui README](./README.md)
