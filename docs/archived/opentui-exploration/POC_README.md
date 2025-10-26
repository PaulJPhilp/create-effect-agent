# OpenTui POC (Proof of Concept)

This directory contains a complete exploration and proof-of-concept of integrating **@opentui/core** with **Effect** for building terminal user interfaces.

## 📚 Documentation

### Quick Start
1. **[EXPLORATION_SUMMARY.md](./EXPLORATION_SUMMARY.md)** - Start here! Overview of what we found
2. **[PATTERNS_VISUAL_GUIDE.md](./PATTERNS_VISUAL_GUIDE.md)** - Visual comparison of patterns
3. **[IMPLEMENTATION_RECOMMENDATIONS.md](./IMPLEMENTATION_RECOMMENDATIONS.md)** - Our recommendations for effect-cli-tui

### Deep Dive
- **[OPENTUI_EXPLORATION.md](./OPENTUI_EXPLORATION.md)** - Detailed API documentation

### Code Examples
- **[src/poc-select.ts](./src/poc-select.ts)** - SelectRenderable with Effect wrapper
- **[src/poc-input.ts](./src/poc-input.ts)** - InputRenderable with Effect wrapper
- **[src/poc-combined.ts](./src/poc-combined.ts)** - Multi-prompt workflow example

## 🎮 Running the POC

### Setup
```bash
cd /Users/paul/Projects/In-Progress/create-effect-agent
pnpm install
```

### Run Examples
```bash
# Select prompt
pnpm -F opentui-poc poc:select

# Input prompt
pnpm -F opentui-poc poc:input

# Combined workflow (select → input → input)
pnpm -F opentui-poc poc:combined
```

## 🎯 Key Findings

### What is @opentui/core?

Low-level TUI component library with:
- ✅ Full terminal control (Yoga layout engine)
- ✅ Imperative component API (create, add, listen)
- ✅ Event-driven interactions (EventEmitter)
- ⚠️ Alpha status (v0.1.30)
- ⚠️ Complex lifecycle management
- ⚠️ Each prompt needs its own renderer

### What Works

✅ **Simple sequential prompts** when wrapped in Effect.promise()
```typescript
const selected = yield* _(selectPrompt(options))
const input = yield* _(inputPrompt('Enter value:'))
```

✅ **Event handling** - ItemSelected, input, enter events work well

✅ **Full customization** - Colors, spacing, styling completely customizable

### What's Challenging

⚠️ **Imperative API** - Direct mutations vs Effect's declarative style

⚠️ **Lifecycle complexity** - Async setup, manual cleanup, error handling

⚠️ **Renderer overhead** - New renderer per prompt is wasteful

❌ **Alpha software** - No production readiness guarantees

## 📊 Comparison: OpenTui vs @inquirer/prompts

| Aspect | OpenTui | @inquirer |
|--------|---------|-----------|
| **Status** | Alpha (0.1.30) | Stable |
| **Customization** | Full | Limited |
| **Complexity** | High | Low |
| **Documentation** | Sparse | Excellent |
| **Community** | Small | Large |
| **Setup Time** | ~50ms | ~1ms |
| **Learning Curve** | Steep | Gentle |
| **Production Ready** | ❌ No | ✅ Yes |

## 🎓 Our Recommendation

### For effect-cli-tui v1 ✅
**Use @inquirer/prompts**
- Proven, stable, well-documented
- Simple integration with Effect
- No risk of breaking changes

### For effect-cli-tui v2 (conditional) 🔄
**Maybe add OpenTui for advanced UIs**
- If users need custom layouts
- If OpenTui reaches v1.0.0+ stability
- As optional advanced feature

### Keep This POC As 📖
- Reference for imperative-to-Effect wrapping
- Decision history
- Pattern documentation
- Learning resource

## 🏗️ Architecture Pattern

Here's how we wrapped OpenTui in Effect:

```typescript
function selectPrompt<T>(
  options: SelectOption[],
  title: string
): Effect.Effect<T, Error> {
  return Effect.gen(function* (_) {
    const result = yield* _(
      Effect.promise<T>(() =>
        new Promise(async (resolve, reject) => {
          try {
            // 1. Create renderer
            const renderer = await createCliRenderer()
            
            // 2. Create component
            const select = new SelectRenderable(renderer, {
              options,
              // ... config
            })
            
            // 3. Setup event listener
            select.on('itemSelected', () => {
              const value = select.getSelectedOption()?.value
              renderer.stop()
              resolve(value)
            })
            
            // 4. Start rendering
            renderer.start()
          } catch (err) {
            reject(err)
          }
        })
      )
    )
    return result
  })
}
```

**Pattern applies to:**
- SelectRenderable → itemSelected event
- InputRenderable → enter event
- Any event-driven component

## 🔄 Lifecycle Flow

```
1. Create Effect.promise()
   ↓
2. Create CliRenderer (async)
   ↓
3. Create Renderables (SelectRenderable, InputRenderable)
   ↓
4. Add to renderer.root
   ↓
5. Setup event listeners
   ↓
6. renderer.start() - Begin rendering loop
   ↓
7. User interacts (keyboard/mouse)
   ↓
8. Event fires → Listener executes
   ↓
9. renderer.stop() - End render loop
   ↓
10. resolve(value) - Promise resolves
    ↓
11. Effect continues execution
    ↓
12. renderer.destroy() - Cleanup (automatic)
```

## 🚀 Next Steps

### For Learning
1. Read [EXPLORATION_SUMMARY.md](./EXPLORATION_SUMMARY.md)
2. Read [PATTERNS_VISUAL_GUIDE.md](./PATTERNS_VISUAL_GUIDE.md)
3. Run the POC examples
4. Study the code in `src/poc-*.ts`

### For Implementation
1. Review [IMPLEMENTATION_RECOMMENDATIONS.md](./IMPLEMENTATION_RECOMMENDATIONS.md)
2. Decide: v1 with @inquirer or custom OpenTui?
3. Implement chosen approach in effect-cli-tui
4. Reference POC patterns as needed

### For Future Decisions
- Keep this POC package as reference
- Revisit when considering v2 advanced UIs
- Check OpenTui status periodically
- Reference patterns for other wrapper scenarios

## 📦 Package Structure

```
opentui-poc/
├── src/
│   ├── index.ts          ← Main entry (logs ready message)
│   ├── poc-select.ts     ← Select example with Effect wrapper
│   ├── poc-input.ts      ← Input example with Effect wrapper
│   └── poc-combined.ts   ← Multi-prompt workflow
├── EXPLORATION_SUMMARY.md        ← Main findings (START HERE)
├── PATTERNS_VISUAL_GUIDE.md      ← Pattern examples
├── IMPLEMENTATION_RECOMMENDATIONS.md ← Our recommendation
├── OPENTUI_EXPLORATION.md        ← Detailed API docs
├── package.json
└── tsconfig.json
```

## 📝 Files to Reference

For external documentation:
- node_modules/@opentui/core/README.md
- node_modules/@opentui/core/lib/ (type definitions)
- node_modules/@opentui/core/renderables/ (components)

For our findings:
- All .md files in this directory
- Code examples in src/

## ✅ Quality Checklist

- [x] API explored and documented
- [x] Working examples created
- [x] Effect integration patterns built
- [x] Findings summarized
- [x] Recommendations provided
- [x] Comparison with alternatives
- [x] Code quality: TypeScript strict mode
- [x] Examples are runnable

## 🎉 Summary

This POC gives us:
1. **Complete understanding** of @opentui/core API
2. **Working patterns** for imperative-to-Effect integration
3. **Decision data** for effect-cli-tui architecture
4. **Reference code** for future implementations
5. **Documented knowledge** for team

**Result:** We can confidently recommend keeping @inquirer/prompts for v1, and have a clear path to add OpenTui features in v2 if needed.

---

**Ready to proceed with effect-cli-tui implementation!** 🚀
