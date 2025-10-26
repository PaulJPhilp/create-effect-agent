# Ink + Effect Examples

Complete working examples demonstrating Ink integration in effect-cli-tui.

## Table of Contents

1. [Simple Select](#simple-select)
2. [Multi-Screen Form](#multi-screen-form)
3. [Dashboard](#dashboard)
4. [Error Handling](#error-handling)
5. [Custom Components](#custom-components)

---

## Simple Select

Basic example showing how to use the select component.

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler } from 'effect-cli-tui'

const runSimpleSelect = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    const choice = yield* _(
      tui.selectOption('What is your favorite framework?', [
        {
          label: 'React',
          value: 'react',
          description: 'JavaScript library',
        },
        {
          label: 'Vue',
          value: 'vue',
          description: 'Progressive framework',
        },
        {
          label: 'Angular',
          value: 'angular',
          description: 'Full framework',
        },
      ])
    )

    console.log(`You selected: ${choice}`)
    return choice
  })

// Run it
Effect.runPromise(runSimpleSelect())
```

**Output:**
```
? What is your favorite framework?
❯ React — JavaScript library
  Vue — Progressive framework
  Angular — Full framework

↑↓ Navigate • Enter Select

You selected: react
```

---

## Multi-Screen Form

Example showing a complete form workflow with multiple screens.

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler, InputScreen, SelectScreen, ConfirmScreen } from 'effect-cli-tui'
import React from 'react'

interface UserConfig {
  name: string
  email: string
  role: string
  confirmed: boolean
}

const runFormFlow = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    const result = yield* _(
      tui.formFlow<UserConfig>({
        title: 'User Configuration',
        screens: [
          {
            id: 'name',
            title: 'Step 1: Personal Info',
            component: ({ onNext, onPrevious }) =>
              React.createElement(InputScreen, {
                title: 'Personal Information',
                prompt: 'Full name:',
                defaultValue: '',
                validate: (v) =>
                  v.trim().length > 0 || 'Name cannot be empty',
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'email',
            title: 'Step 2: Contact Info',
            component: ({ onNext, onPrevious }) =>
              React.createElement(InputScreen, {
                title: 'Contact Information',
                prompt: 'Email address:',
                defaultValue: '',
                validate: (v) =>
                  v.includes('@') || 'Please enter a valid email',
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'role',
            title: 'Step 3: Account Type',
            component: ({ onNext, onPrevious }) =>
              React.createElement(SelectScreen, {
                title: 'Select Your Account Type',
                options: [
                  {
                    label: 'Administrator',
                    value: 'admin',
                    description: 'Full system access',
                  },
                  {
                    label: 'Developer',
                    value: 'developer',
                    description: 'Development tools access',
                  },
                  {
                    label: 'User',
                    value: 'user',
                    description: 'Basic access',
                  },
                ],
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'confirmed',
            title: 'Step 4: Review',
            component: ({ onNext, onPrevious }) =>
              React.createElement(ConfirmScreen, {
                title: 'Confirm Setup',
                message: 'Create account with these details?',
                onConfirm: () => onNext(true),
                onCancel: () => onNext(false),
              }),
          },
        ],
      })
    )

    console.log('\n✅ Configuration saved:')
    console.log(`  Name: ${result.name}`)
    console.log(`  Email: ${result.email}`)
    console.log(`  Role: ${result.role}`)
    console.log(`  Confirmed: ${result.confirmed}`)

    return result
  })

// Run it
Effect.runPromise(runFormFlow())
```

**Flow:**
```
Step 1: Personal Info
Personal Information
Full name: [John Doe_]

Enter Submit

---

Step 2: Contact Info
Contact Information
Email address: [john@example.com_]

Enter Submit

---

Step 3: Account Type
Select Your Account Type
  Administrator — Full system access
❯ Developer — Development tools access
  User — Basic access

↑↓ Navigate • Enter Select

---

Step 4: Review
Confirm Setup
Create account with these details?
[Yes] [No]

← → Navigate • Enter Confirm

✅ Configuration saved:
  Name: John Doe
  Email: john@example.com
  Role: developer
  Confirmed: true
```

---

## Dashboard

Example showing a real-time dashboard pattern.

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler, SelectScreen, InputScreen } from 'effect-cli-tui'
import React from 'react'

interface Project {
  name: string
  status: 'building' | 'deployed' | 'failed'
  progress: number
}

const runDashboard = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    // First, select a project
    const projects: Project[] = [
      { name: 'api-server', status: 'building', progress: 65 },
      { name: 'web-client', status: 'deployed', progress: 100 },
      { name: 'mobile-app', status: 'failed', progress: 30 },
    ]

    const selectedProject = yield* _(
      tui.selectOption<string>('Select project to manage', [
        { label: 'API Server', value: 'api-server', description: 'Building...' },
        { label: 'Web Client', value: 'web-client', description: 'Deployed ✓' },
        { label: 'Mobile App', value: 'mobile-app', description: 'Failed ✗' },
      ])
    )

    const project = projects.find((p) => p.name === selectedProject)!

    // Show project details
    console.log(`\n📊 Project: ${project.name}`)
    console.log(`   Status: ${project.status}`)
    console.log(`   Progress: ${project.progress}%`)

    // Ask for action
    const action = yield* _(
      tui.selectOption('What would you like to do?', [
        { label: 'View Logs', value: 'logs' },
        { label: 'Rebuild', value: 'rebuild' },
        { label: 'Deploy', value: 'deploy' },
        { label: 'Go Back', value: 'back' },
      ])
    )

    if (action !== 'back') {
      console.log(`\n⚙️  Executing: ${action}`)
    }

    return {
      project: selectedProject,
      action,
    }
  })

// Run it
Effect.runPromise(runDashboard())
```

---

## Error Handling

Example showing how to handle errors properly.

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler, InkError } from 'effect-cli-tui'

const runWithErrorHandling = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    // Method 1: Using yield* with error handling
    const result = yield* _(
      tui.selectOption('Choose an option', [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
      ]).pipe(
        Effect.catchTag('InkError', (err) => {
          console.error(`Rendering error: ${err.message}`)
          return Effect.succeed('default')
        })
      )
    )

    console.log(`Selected: ${result}`)
    return result
  })

// Run it with proper error handling
Effect.runPromise(runWithErrorHandling()).catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
```

---

## Custom Components

Example showing how to create custom screen components.

```typescript
import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { useInput } from 'ink'
import * as Effect from 'effect/Effect'
import { InkTUIHandler } from 'effect-cli-tui'

/**
 * Custom number input component
 */
function NumberInputScreen({
  onNext,
  onPrevious,
}: {
  onNext: (value: number) => void
  onPrevious?: () => void
}): React.ReactElement {
  const [value, setValue] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) {
      setValue((v) => v + 1)
    }
    if (key.downArrow) {
      setValue((v) => Math.max(0, v - 1))
    }
    if (key.return) {
      onNext(value)
    }
    if (key.escape && onPrevious) {
      onPrevious()
    }
  })

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Text bold color="cyan">
        Select a number
      </Text>
      <Text color="green">Current value: {value}</Text>
      <Text dimColor>↑ Increase • ↓ Decrease • Enter Confirm</Text>
    </Box>
  )
}

const runCustomComponent = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    const number = yield* _(
      tui.formFlow({
        title: 'Number Selection',
        screens: [
          {
            id: 'number',
            title: 'Choose a number',
            component: NumberInputScreen,
          },
        ],
      })
    )

    console.log(`You selected: ${number.number}`)
    return number
  })

// Run it
Effect.runPromise(runCustomComponent())
```

---

## Real-World: Project Setup CLI

Complete example of a project setup CLI.

```typescript
import * as Effect from 'effect/Effect'
import { InkTUIHandler, InputScreen, SelectScreen, ConfirmScreen } from 'effect-cli-tui'
import React from 'react'
import * as fs from 'fs/promises'

interface ProjectSetup {
  projectName: string
  description: string
  template: string
  packageManager: string
  typescript: boolean
  setupGit: boolean
}

const setupProject = () =>
  Effect.gen(function* (_) {
    const tui = new InkTUIHandler()

    const config = yield* _(
      tui.formFlow<ProjectSetup>({
        title: 'Create New Project',
        screens: [
          {
            id: 'projectName',
            title: 'Project Name',
            component: ({ onNext, onPrevious }) =>
              React.createElement(InputScreen, {
                title: 'Project Setup',
                prompt: 'Project name:',
                validate: (v) =>
                  /^[a-z0-9-]+$/.test(v) ||
                  'Only lowercase letters, numbers, and hyphens',
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'description',
            title: 'Description',
            component: ({ onNext, onPrevious }) =>
              React.createElement(InputScreen, {
                title: 'Project Setup',
                prompt: 'Description:',
                defaultValue: 'A new project',
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'template',
            title: 'Template',
            component: ({ onNext, onPrevious }) =>
              React.createElement(SelectScreen, {
                title: 'Select Template',
                options: [
                  { label: 'Basic', value: 'basic' },
                  { label: 'CLI', value: 'cli' },
                  { label: 'Monorepo', value: 'monorepo' },
                ],
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'packageManager',
            title: 'Package Manager',
            component: ({ onNext, onPrevious }) =>
              React.createElement(SelectScreen, {
                title: 'Select Package Manager',
                options: [
                  { label: 'npm', value: 'npm' },
                  { label: 'yarn', value: 'yarn' },
                  { label: 'pnpm', value: 'pnpm' },
                ],
                onNext,
                onPrevious,
              }),
          },
          {
            id: 'typescript',
            title: 'TypeScript',
            component: ({ onNext, onPrevious }) =>
              React.createElement(ConfirmScreen, {
                title: 'TypeScript',
                message: 'Use TypeScript?',
                onConfirm: () => onNext(true),
                onCancel: () => onNext(false),
              }),
          },
          {
            id: 'setupGit',
            title: 'Git',
            component: ({ onNext, onPrevious }) =>
              React.createElement(ConfirmScreen, {
                title: 'Git',
                message: 'Initialize Git repository?',
                onConfirm: () => onNext(true),
                onCancel: () => onNext(false),
              }),
          },
          {
            id: 'confirm',
            title: 'Review',
            component: ({ onNext, onPrevious }) =>
              React.createElement(ConfirmScreen, {
                title: 'Create Project?',
                message: `Create "${config.projectName}" with these settings?`,
                onConfirm: () => onNext(true),
                onCancel: () => onNext(false),
              }),
          },
        ],
      })
    )

    // Create project
    console.log('\n✨ Creating project...')
    console.log(`📁 Name: ${config.projectName}`)
    console.log(`📝 Description: ${config.description}`)
    console.log(`📦 Template: ${config.template}`)
    console.log(`🔧 Package Manager: ${config.packageManager}`)
    console.log(`📘 TypeScript: ${config.typescript ? 'Yes' : 'No'}`)
    console.log(`🌳 Git: ${config.setupGit ? 'Yes' : 'No'}`)

    return config
  })

// Run it
Effect.runPromise(setupProject()).then((config) => {
  console.log('\n✅ Project created successfully!')
})
```

---

## Tips & Tricks

### Combining with Effect Utilities

```typescript
// Retry on error
const effect = tui.selectOption(...).pipe(
  Effect.retry({ times: 3 })
)

// Set timeout
const effect = tui.inputPrompt(...).pipe(
  Effect.timeoutFail({
    onTimeout: () => new InkError('Timeout', 'User took too long'),
    duration: '30 seconds',
  })
)

// Chain multiple operations
const effect = Effect.gen(function* (_) {
  const name = yield* _(tui.inputPrompt('Name'))
  const email = yield* _(tui.inputPrompt('Email'))
  const confirmed = yield* _(tui.confirm('Is this correct?'))
  return { name, email, confirmed }
})
```

### Performance Patterns

```typescript
// Avoid unnecessary renders
function CustomScreen({ onNext, onPrevious }) {
  const [value, setValue] = useState('')

  useInput((input) => {
    if (input === 'Enter') {
      // Only trigger on Enter, not on every keystroke
      onNext(value)
    }
  })

  return <Box>...</Box>
}
```

### State Management Patterns

```typescript
// Accumulate complex state
interface FormState {
  data: Record<string, any>
  errors: Record<string, string>
  visited: Set<string>
}

// Use Effect combinators for state
const effect = Effect.gen(function* (_) {
  let state = initialState
  
  for (const screen of screens) {
    const value = yield* _(screen.effect)
    state = {
      ...state,
      data: { ...state.data, [screen.id]: value },
    }
  }
  
  return state
})
```

---

## Next Steps

- Read [INK_INTEGRATION_GUIDE.md](./INK_INTEGRATION_GUIDE.md) for detailed API docs
- Explore [Ink documentation](https://github.com/vadimdemedes/ink)
- Check [Effect documentation](https://effect.website/) for advanced patterns
- See effect-cli-tui [README](./README.md)

