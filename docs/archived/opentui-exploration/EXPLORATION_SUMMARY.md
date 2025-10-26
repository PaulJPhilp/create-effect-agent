# @opentui/core - API Exploration Summary

## What We Found

After exploring the @opentui/core package, here's what we discovered:

### Core Components & Architecture

#### **CliRenderer**
The main entry point that manages:
- Terminal state and rendering loop
- I/O handling (stdin/stdout)  
- Event dispatching
- Lifecycle (start, pause, stop, destroy)

```typescript
const renderer = await createCliRenderer(config)
renderer.root.add(component)
renderer.start()
```

#### **Renderable System**
Base class for all UI components that:
- Extend EventEmitter
- Use Yoga layout engine
- Support flexbox-style positioning
- Handle keyboard/mouse events

#### **Available Components**
```
SelectRenderable  - Single/multi-select from list
InputRenderable   - Single-line text input
TextRenderable    - Static text display
BoxRenderable     - Container with borders
TextAreaRenderable - Multi-line text input
ScrollBoxRenderable - Scrollable container
TabSelectRenderable - Tab-based selection
SliderRenderable  - Value slider
CodeRenderable    - Syntax-highlighted code
```

---

## Key Findings: Imperative API

### **Pattern 1: Component Creation**
```typescript
const select = new SelectRenderable(renderer, {
  id: 'my-select',
  options: [{ name: 'A', description: '...', value: 'a' }],
  backgroundColor: '#001122',
  textColor: '#FFFFFF',
  // ... many styling options
})
```

**Characteristics:**
- Direct instantiation with options object
- Full control over styling and behavior
- Immediate creation (no lazy evaluation)
- Mutable state management

### **Pattern 2: Event-Driven Interactions**
```typescript
select.on('itemSelected', () => {
  const option = select.getSelectedOption()
  // Handle selection
})

input.on('enter', (value: string) => {
  // Handle confirmed input  
})

input.on('input', (value: string) => {
  // Handle every keystroke
})
```

**Characteristics:**
- EventEmitter-based (Node.js standard)
- Multiple event types per component
- Direct callback style
- Manual listener management

### **Pattern 3: Imperative State Mutation**
```typescript
// Select navigation
select.moveUp()
select.moveDown()
select.setSelectedIndex(2)

// Input manipulation
input.value = 'new value'
input.insertText('text')
input.deleteCharacter('backward')
input.cursorPosition = 5
```

**Characteristics:**
- Direct method calls
- Immediate state changes
- No queuing or scheduling
- Full procedural control

### **Pattern 4: Lifecycle Management**
```typescript
// Setup
renderer.setupTerminal()
renderer.root.add(component)

// Running
renderer.start()    // Start render loop
renderer.pause()    // Pause rendering
renderer.resume()   // Resume
renderer.stop()     // Stop loop
renderer.destroy()  // Cleanup
```

**Characteristics:**
- Explicit lifecycle phases
- Async setup required
- Must manage cleanup
- Terminal state complexity

---

## Effect Integration Patterns We've Built

### **Pattern A: Promise Wrapper**
```typescript
function selectPrompt(options, title): Effect.Effect<string, Error> {
  return Effect.gen(function* (_) {
    const result = yield* _(
      Effect.promise<string>(() =>
        new Promise(async (resolve, reject) => {
          // Setup OpenTui components
          // Listen for itemSelected event
          // Resolve with selected value
        })
      )
    )
    return result
  })
}
```

**Trade-offs:**
- ✅ Wraps imperative API functionally
- ✅ Enables sequential composition
- ⚠️ Hides internal event handling
- ⚠️ Difficult to interrupt or cancel
- ⚠️ Limited error handling granularity

### **Pattern B: Sequential Composition** (poc-combined.ts)
```typescript
const workflow = Effect.gen(function* (_) {
  const framework = yield* _(selectPrompt(frameworks, 'Framework'))
  const name = yield* _(inputPrompt('Project name'))
  const version = yield* _(inputPrompt('Version', '1.0.0'))
  
  return { framework, name, version }
})
```

**Characteristics:**
- Each prompt is independent renderer instance
- Sequential execution
- Errors propagate up through Effect chain
- Clean separation of concerns

---

## @opentui/core vs @inquirer/prompts

### **OpenTui (@opentui/core)**
- **Level**: Low-level renderables
- **Control**: Maximum flexibility
- **API Style**: Imperative
- **Styling**: Full customization
- **Components**: Basic primitives
- **Layout**: Yoga layout engine
- **Status**: Alpha (0.1.30)
- **Use Case**: Custom TUI applications

### **@inquirer/prompts**
- **Level**: High-level prompts
- **Control**: Opinionated defaults
- **API Style**: Promise-based
- **Styling**: Limited customization
- **Components**: Built-in prompts (select, input, confirm, etc.)
- **Layout**: Simple sequential
- **Status**: Stable
- **Use Case**: CLI tools and simple prompts

### **Decision Matrix**

| Need | OpenTui | @inquirer | Both |
|------|---------|-----------|------|
| Simple prompts | ❌ | ✅ | Use @inquirer |
| Custom layouts | ✅ | ❌ | Use OpenTui |
| Real-time feedback | ✅ | ⚠️ | Use OpenTui |
| Fast prototyping | ❌ | ✅ | Use @inquirer |
| Full styling control | ✅ | ❌ | Use OpenTui |
| Production stability | ⚠️ | ✅ | Use @inquirer |

---

## Challenges for Effect Integration

### **1. Async Setup Complexity**
```typescript
// Must await renderer creation
const renderer = await createCliRenderer()  // Async!
```
- Every prompt needs its own renderer
- Startup overhead per interaction
- Terminal state synchronization

### **2. Event Listener Lifecycle**
```typescript
// Who manages these?
select.on('itemSelected', () => { ... })
input.on('enter', () => { ... })
// No automatic cleanup!
```
- Manual listener attachment
- Manual listener removal
- Risk of memory leaks
- Event race conditions

### **3. Renderer Lifecycle**
```typescript
// Multiple lifecycle phases
renderer.setupTerminal()    // async
renderer.start()            // starts loop
renderer.stop()             // stops loop
renderer.destroy()          // cleanup
// Errors in any phase?
```

### **4. Cancellation & Interruption**
```typescript
// How to cancel mid-interaction?
// How to handle Ctrl+C gracefully?
// How to cleanup on Effect.interrupt?
```
- No built-in cancellation support
- Manual promise resolution needed
- Terminal state may be corrupted

### **5. Composability Limits**
```typescript
// Each prompt is isolated
const result1 = yield* _(selectPrompt(...))
const result2 = yield* _(inputPrompt(...))
// Can't share components across prompts
// Can't have dependent layouts
```

---

## What Works Well ✅

1. **Simple Sequential Prompts**
   - Select, input, select, input...
   - Each in its own renderer
   - Clean Effect composition

2. **Event-Driven Architecture**
   - Clear event semantics
   - Predictable event ordering
   - Works well with promise wrappers

3. **Full Terminal Control**
   - Flexbox layout system
   - Styling and customization
   - Mouse support

4. **Keyboard Handling**
   - Built-in navigation keys
   - Extensible with custom handlers
   - Works with Effect async

---

## What's Challenging ⚠️

1. **Imperative-to-Functional Gap**
   - Direct mutations vs. declarative
   - Event callbacks vs. streams
   - Procedural vs. compositional

2. **Renderer Lifecycle**
   - One renderer per prompt is wasteful
   - But shared renderer is complex
   - Terminal state management is tricky

3. **Error Handling**
   - Terminal may be corrupted on error
   - Cleanup is manual and error-prone
   - Hard to guarantee state recovery

4. **Interruption & Cancellation**
   - No built-in support
   - Manual promise handling required
   - Race conditions possible

5. **Production Readiness**
   - Alpha version (0.1.30)
   - May have breaking changes
   - Limited documentation
   - Small community

---

## Recommendations

### **For effect-cli-tui v1 (Current)**
```
→ Keep @inquirer/prompts
→ Reason: Stable, simple, fits current use case
→ Add OpenTui later as optional feature
```

### **For effect-cli-tui v2 (Future)**
```
→ Could add OpenTui for advanced UIs
→ Example: Real-time dashboards, custom layouts
→ Hybrid approach: @inquirer + OpenTui
```

### **For the POC (Now)**
```
✅ We have working examples
✅ Select + Input prompts wrapped in Effect
✅ Sequential composition working
✅ Learned what works and what doesn't
⏭️ Next: Decide on production strategy
```

---

## Files We've Explored

```
packages/opentui-poc/
├── src/
│   ├── index.ts           ← Main POC entry
│   ├── poc-select.ts      ✅ Working select example
│   ├── poc-input.ts       ✅ Working input example
│   └── poc-combined.ts    ✅ Working workflow example
├── OPENTUI_EXPLORATION.md ← Detailed API docs
└── package.json           ← Dependencies configured
```

---

## Next Steps

**Option 1: Keep Playing** 🧪
- Build more complex layouts
- Test interruption/cancellation
- Explore multi-component views

**Option 2: Make Decision** 🎯
- Use @inquirer for effect-cli-tui v1
- Plan OpenTui for v2
- Document patterns learned

**Option 3: Hybrid Approach** 🔀
- Use @inquirer for simple prompts
- Use OpenTui for complex UIs
- Share decision logic between systems

**Your call!** What would you like to explore next? 🚀
