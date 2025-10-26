# OpenTui Integration Patterns - Visual Guide

## Architecture Comparison

### @inquirer/prompts Architecture
```
┌─────────────────────────────────────┐
│   Your Effect Application           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   inquirer.prompt(questions)        │  ← Promise-based
│   Returns: Promise<Answers>         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Terminal Interaction (built-in)   │
│   - Select prompt                   │
│   - Input prompt                    │
│   - Confirm prompt                  │
└─────────────────────────────────────┘
```

**Characteristics:**
- Opinionated high-level API
- One promise per questionnaire
- Built-in UX patterns
- Simple terminal handling

---

### @opentui/core Architecture
```
┌─────────────────────────────────────┐
│   Your Effect Application           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Effect.promise() wrapper          │  ← We build this
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   createCliRenderer()               │  ← Async setup
│   ↓                                 │
│   new SelectRenderable()            │  ← Create component
│   new InputRenderable()             │  ← Create component
│   renderer.root.add()               │  ← Add to tree
│   renderer.start()                  │  ← Start loop
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   EventEmitter.on('itemSelected')   │  ← Listen for events
│   ↓                                 │
│   renderer.stop()                   │  ← Stop loop
│   renderer.destroy()                │  ← Cleanup
└─────────────────────────────────────┘
```

**Characteristics:**
- Low-level component API
- We manage the promise wrapper
- Custom UX patterns possible
- Complex terminal handling required

---

## Code Pattern Comparison

### Simple Select Prompt

#### With @inquirer/prompts
```typescript
import inquirer from 'inquirer'

const answer = await inquirer.prompt([
  {
    type: 'list',
    name: 'framework',
    message: 'Choose a framework:',
    choices: ['React', 'Vue', 'Angular', 'Svelte'],
  }
])
console.log('Selected:', answer.framework)
```

**Lines of code:** ~10
**Complexity:** Low
**Customization:** Limited

---

#### With @opentui/core (via poc-select.ts)
```typescript
import { createCliRenderer, SelectRenderable } from '@opentui/core'

const renderer = await createCliRenderer()

const select = new SelectRenderable(renderer, {
  options: [
    { name: 'React', value: 'react' },
    { name: 'Vue', value: 'vue' },
    { name: 'Angular', value: 'angular' },
    { name: 'Svelte', value: 'svelte' },
  ],
  backgroundColor: '#001122',
  textColor: '#FFFFFF',
})

renderer.root.add(select)
renderer.start()

select.on('itemSelected', () => {
  const selected = select.getSelectedOption()
  console.log('Selected:', selected.value)
  renderer.stop()
})
```

**Lines of code:** ~30
**Complexity:** High
**Customization:** Full control

---

#### With Effect + @opentui/core (wrapped)
```typescript
import { selectPrompt } from './poc-select'
import { Effect } from 'effect'

const workflow = Effect.gen(function* (_) {
  const selected = yield* _(selectPrompt(
    ['React', 'Vue', 'Angular', 'Svelte'],
    'Choose a framework:'
  ))
  console.log('Selected:', selected)
})

Effect.runPromise(workflow)
```

**Lines of code:** ~10 (after wrapping)
**Complexity:** Low
**Customization:** Depends on wrapper

---

## Event Handling Patterns

### Sequential Prompts Pattern

#### With @inquirer/prompts
```typescript
const answers = await inquirer.prompt([
  { type: 'list', name: 'framework', choices: [...] },
  { type: 'input', name: 'name', message: 'Project name:' },
  { type: 'input', name: 'version', message: 'Version:' },
])

console.log(answers.framework, answers.name, answers.version)
```

---

#### With Effect + @opentui/core (wrapper)
```typescript
const workflow = Effect.gen(function* (_) {
  const framework = yield* _(selectPrompt(
    ['React', 'Vue', ...],
    'Framework:'
  ))
  const name = yield* _(inputPrompt('Project name:'))
  const version = yield* _(inputPrompt('Version:'))
  
  return { framework, name, version }
})

Effect.runPromise(workflow)
```

**Result:** Very similar code!
- Both handle sequential prompts cleanly
- Both support error propagation
- Both have similar composability

---

## State Management Comparison

### Tracking Current Selection

#### With @inquirer/prompts
```typescript
// Built-in - you don't think about it
// Just get the answer at the end
const answer = await inquirer.prompt([...])
```

#### With @opentui/core
```typescript
const select = new SelectRenderable(...)

// Monitor in real-time
select.on('selectionChanged', (index: number) => {
  const current = select.getSelectedOption()
  console.log(`Selected index: ${index}`)
  console.log(`Current option: ${current.name}`)
})

// Read at any time
const index = select.getSelectedIndex()
const option = select.getSelectedOption()
```

**OpenTui Advantage:** Real-time feedback during interaction

---

## Styling & Customization

### @inquirer/prompts
```typescript
// Limited customization
const answer = await inquirer.prompt([
  {
    type: 'list',
    name: 'color',
    message: 'Pick a color:',
    // That's it - colors are predefined
  }
])
```

### @opentui/core
```typescript
// Full customization
const select = new SelectRenderable(renderer, {
  backgroundColor: '#001122',
  textColor: '#FFFFFF',
  focusedBackgroundColor: '#0f3a7d',
  focusedTextColor: '#FFFF00',
  selectedBackgroundColor: '#0f5a7d',
  selectedTextColor: '#FFFFFF',
  descriptionColor: '#888888',
  selectedDescriptionColor: '#CCCCCC',
  showScrollIndicator: true,
  wrapSelection: true,
})
```

**OpenTui Advantage:** Complete control over appearance

---

## Layout Capabilities

### @inquirer/prompts
```
+─────────────────────────────────────────+
│ Choose your favorite framework:          │
│ ❯ React                                  │
│   Vue                                    │
│   Angular                                │
│   Svelte                                 │
+─────────────────────────────────────────+
```
- Fixed layout
- Simple stacking
- Single column

### @opentui/core
```
┌──────────────────────────────────────────────────┐
│ Project Setup                                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  Framework Selection      │  Recent Projects    │
│  ┌────────────────────┐   │  ┌─────────────┐  │
│  │ ❯ React           │   │  │ • proj-a    │  │
│  │   Vue             │   │  │ • proj-b    │  │
│  │   Angular         │   │  │ • proj-c    │  │
│  └────────────────────┘   │  └─────────────┘  │
│                                                  │
│  Project Details:                                │
│  ┌──────────────────────────────────────────┐  │
│  │ Name: |                                   │  │
│  │ Version: 1.0.0                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```
- Flexbox layout
- Multiple columns
- Complex arrangements
- Real-time updates

---

## Performance Characteristics

| Metric | @inquirer | @opentui |
|--------|-----------|----------|
| Setup Time | ~1ms | ~50ms (renderer init) |
| Per-Prompt | Quick | Slower (new renderer) |
| Memory | Low | Medium (renderer overhead) |
| Rendering | Frame-based | Real-time loop |
| CPU Usage | On-demand | Continuous (FPS limited) |

---

## Decision Tree

```
Need simple CLI prompts?
├─ Yes → Use @inquirer/prompts ✅
└─ No → Complex UIs needed?
    ├─ Yes → Use @opentui/core ✅
    └─ No → Either works fine
```

---

## Hybrid Strategy (Recommended)

```
effect-cli-tui Structure
│
├─ Simple prompts layer
│  └─ Uses: @inquirer/prompts
│     └─ Fast, stable, familiar
│
├─ Advanced UI layer
│  └─ Uses: @opentui/core
│     └─ Custom layouts, real-time feedback
│
└─ Shared Effect layer
   └─ Unified error handling
   └─ Common patterns
   └─ Consistent API
```

**Benefits:**
- Best of both worlds
- Users get simple API for common cases
- Advanced customization available
- Can evolve gradually

---

## File Reference

All the exploration code is in `packages/opentui-poc/`:
```
src/
├── poc-select.ts     ← SelectRenderable + Effect wrapper
├── poc-input.ts      ← InputRenderable + Effect wrapper
└── poc-combined.ts   ← Multi-prompt workflow example
```

Each file is fully functional and demonstrates:
- ✅ How to wrap OpenTui in Effect
- ✅ How to compose sequential prompts
- ✅ Error handling
- ✅ Lifecycle management
