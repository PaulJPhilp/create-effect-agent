# @opentui/core API Exploration

## Overview

@opentui/core is a TypeScript library for building TUIs with:
- **Imperative API** for creating and manipulating UI components
- **Event-driven architecture** using EventEmitter
- **Yoga layout engine** for flexible component positioning
- **Native renderer** (Zig-based) for high-performance terminal rendering
- **Rich component library** (Select, Input, Box, Text, Textarea, etc.)

## Core Architecture

### 1. **CliRenderer** - The Main Entry Point
```typescript
import { createCliRenderer } from '@opentui/core'

const renderer = await createCliRenderer(config?: CliRendererConfig)
```

**Responsibilities:**
- Manages terminal state and rendering loop
- Handles I/O (stdin/stdout)
- Provides the root renderable container
- Manages lifecycle (start, pause, stop, destroy)

**Key Properties:**
- `root: RootRenderable` - Main container for all components
- `width: number` - Terminal width
- `height: number` - Terminal height
- `isRunning: boolean` - Render loop status
- `useMouse: boolean` - Enable/disable mouse events

**Key Methods:**
- `start()` - Start the render loop
- `auto()` - Auto-start on demand
- `pause()` / `resume()` / `stop()` - Control render loop
- `destroy()` - Cleanup and teardown
- `setupTerminal()` - Initialize terminal

### 2. **Renderables** - UI Components

All renderables extend `Renderable` which extends `EventEmitter`.

#### SelectRenderable
Used for presenting a list of options to choose from.

**Constructor Options:**
```typescript
interface SelectRenderableOptions extends RenderableOptions {
  options?: SelectOption[]  // Array of { name, description, value }
  backgroundColor?: ColorInput
  textColor?: ColorInput
  focusedBackgroundColor?: ColorInput
  focusedTextColor?: ColorInput
  selectedBackgroundColor?: ColorInput
  selectedTextColor?: ColorInput
  descriptionColor?: ColorInput
  selectedDescriptionColor?: ColorInput
  showScrollIndicator?: boolean
  wrapSelection?: boolean
  showDescription?: boolean
  itemSpacing?: number
  fastScrollStep?: number
}
```

**Key Methods:**
- `getSelectedOption()` - Get currently selected option
- `getSelectedIndex()` - Get index of selected option
- `moveUp(steps?)` - Move selection up
- `moveDown(steps?)` - Move selection down
- `selectCurrent()` - Confirm selection
- `setSelectedIndex(index)` - Set selected index programmatically

**Key Events:**
- `selectionChanged` - Selection index changed (fires on every move)
- `itemSelected` - User pressed Enter to confirm

**Built-in Key Handling:**
- ↑/↓ (or j/k) - Navigate
- Enter - Confirm selection
- Esc - Cancel

#### InputRenderable
Used for text input.

**Constructor Options:**
```typescript
interface InputRenderableOptions extends RenderableOptions {
  backgroundColor?: ColorInput
  textColor?: ColorInput
  focusedBackgroundColor?: ColorInput
  focusedTextColor?: ColorInput
  placeholder?: string
  placeholderColor?: ColorInput
  cursorColor?: ColorInput
  maxLength?: number
  value?: string
}
```

**Key Methods:**
- `value` (getter/setter) - Get/set input value
- `cursorPosition` (getter/setter) - Get/set cursor position
- `insertText(text)` - Insert text at cursor
- `deleteCharacter(direction)` - Delete character
- `focus()` / `blur()` - Focus management

**Key Events:**
- `input` - Text changed (fires on every keystroke)
- `change` - Text committed
- `enter` - Enter pressed

**Built-in Key Handling:**
- Regular characters - Insert into input
- Backspace - Delete backward
- Delete - Delete forward
- Ctrl+A - Select all
- Ctrl+U - Clear line
- Enter - Confirm (emits `enter` event)

#### Other Available Renderables
- `Text` - Static text display
- `Box` - Container with borders
- `Textarea` - Multi-line text input
- `ScrollBox` - Scrollable container
- `TabSelect` - Tab-based selection
- `Slider` - Value slider
- `Code` - Code display with syntax highlighting

### 3. **Layout System**

Uses Yoga (Facebook's layout engine) for flexible positioning.

**Common Layout Options:**
```typescript
interface LayoutOptions {
  flexGrow?: number
  flexShrink?: number
  flexDirection?: 'row' | 'column'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  flexBasis?: number | 'auto'
  position?: 'relative' | 'absolute'
  top?: number | 'auto' | `${number}%`
  left?: number | 'auto' | `${number}%`
  width?: number | 'auto' | `${number}%`
  height?: number | 'auto' | `${number}%`
  margin?: number | `${number}%`
  padding?: number | `${number}%`
  minWidth?: number | 'auto'
  maxWidth?: number | 'auto'
  minHeight?: number | 'auto'
  maxHeight?: number | 'auto'
}
```

### 4. **Configuration Options**

```typescript
interface CliRendererConfig {
  stdin?: NodeJS.ReadStream                // Default: process.stdin
  stdout?: NodeJS.WriteStream              // Default: process.stdout
  exitOnCtrlC?: boolean                    // Exit on Ctrl+C
  debounceDelay?: number                   // Resize debounce (ms)
  targetFps?: number                       // Target FPS for render loop
  memorySnapshotInterval?: number          // Memory profiling interval
  useThread?: boolean                      // Use worker thread for rendering
  gatherStats?: boolean                    // Collect performance stats
  maxStatSamples?: number                  // Max performance samples to keep
  enableMouseMovement?: boolean            // Enable mouse move events
  useMouse?: boolean                       // Enable mouse input
  useAlternateScreen?: boolean             // Use alternate screen buffer
  useConsole?: boolean                     // Allow console output
  postProcessFns?: Array<(buffer, dt) => void>  // Post-processing filters
}
```

## Event System

All renderables emit events using Node's EventEmitter.

**Common Patterns:**
```typescript
// Listen for events
renderable.on('eventName', (data) => {
  // Handle event
})

// One-time listeners
renderable.once('eventName', () => {})

// Remove listeners
renderable.off('eventName', handler)
```

## Integration Patterns

### Imperative Pattern (Current OpenTui Design)
```typescript
const renderer = await createCliRenderer()

const select = new SelectRenderable(renderer, {
  options: [...]
})

renderer.root.add(select)
renderer.start()

select.on('itemSelected', (event) => {
  const selected = select.getSelectedOption()
  // Handle selection
})
```

**Characteristics:**
- Direct component creation
- Manual event listeners
- Imperative state mutations
- Event-driven interactions
- Full control over lifecycle

### Comparison with @inquirer/prompts
- **@inquirer** - Higher-level prompts (select, input, confirm, etc.)
- **OpenTui** - Lower-level renderables with more control
- **OpenTui** - Full terminal control (layout, styling, positioning)
- **@inquirer** - Simpler, more opinionated API

## Challenges for Effect Integration

### 1. **Imperative-to-Functional Mismatch**
- OpenTui uses imperative APIs (direct method calls, mutations)
- Effect prefers declarative, functional compositions
- Need to wrap imperative calls in Effect.async

### 2. **Event Listener Management**
- OpenTui uses EventEmitter callbacks
- Effect prefers structured concurrency
- Need to handle listener setup/teardown properly

### 3. **Lifecycle Complexity**
- Renderer startup/teardown is async
- Terminal state management is complex
- Multiple phases: setup → run → cleanup

### 4. **User Interaction Handling**
- Events fire asynchronously during render loop
- Need to coordinate with Effect runtime
- Risk of event races and state inconsistencies

## Next Steps

1. **Simple Example** - Create a basic select prompt
2. **Event Pattern** - Test event listener wrapping
3. **Layout Pattern** - Test multi-component layouts
4. **Effect Integration** - Wrap in Effect context
5. **Comparison** - Compare imperative vs @inquirer patterns
