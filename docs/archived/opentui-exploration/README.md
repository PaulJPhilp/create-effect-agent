# OpenTui Exploration Archive

**Date Completed:** October 25, 2025  
**Status:** Archived - Reference Only  
**Decision:** Not chosen for v1 (see IMPLEMENTATION_RECOMMENDATIONS.md)

---

## Contents

This archive contains the complete OpenTui + Effect exploration:

- **POC_README.md** - Overview and quick start guide
- **EXPLORATION_SUMMARY.md** - Technical findings and core architecture
- **PATTERNS_VISUAL_GUIDE.md** - Integration patterns and visual comparisons
- **OPENTUI_EXPLORATION.md** - Detailed API reference
- **IMPLEMENTATION_RECOMMENDATIONS.md** - Decision rationale and roadmap
- **COMPLETE_REPORT.md** - Executive summary
- **INDEX.md** - Navigation guide with reading paths

---

## Key Decision

After thorough evaluation, we chose **@inquirer/prompts** for v1 because:

- **OpenTui is alpha software** (v0.1.30)
- **Not production-ready** - breaking changes likely
- **Limited documentation** - sparse examples, incomplete API docs
- **Small community** - limited support and examples
- **Complex lifecycle** - high risk of terminal state corruption

### Risk Assessment

| Factor | Risk | Impact |
|--------|------|--------|
| Alpha Status | 🔴 High | Breaking changes disrupts release |
| Documentation | 🔴 High | Difficult to debug and extend |
| Community | 🟡 Medium | Limited support resources |
| Maturity | 🔴 High | No production track record |
| Complexity | 🔴 High | More surface area for bugs |

---

## What We Learned

### OpenTui Strengths ✅
- Full terminal control (Yoga layout engine)
- Imperative component API
- Event-driven (EventEmitter)
- Highly customizable styling
- Real-time interaction feedback

### OpenTui Challenges ⚠️
- Each prompt needs its own renderer instance
- Complex lifecycle management (async setup, manual cleanup)
- Terminal state can be corrupted on errors
- Event listener cleanup is manual and error-prone
- Renderer overhead adds latency

### Integration Patterns ✅
We successfully demonstrated:
- Wrapping imperative APIs in Effect.promise()
- Event listener patterns for interactive components
- Sequential prompt composition with Effect.gen
- Lifecycle management (setup → run → cleanup)
- Error propagation through Effect chains

---

## For Future Reference

### If You Need to Revisit OpenTui (v2+ Advanced Features)

**Step 1:** Read the decision documents
```
1. IMPLEMENTATION_RECOMMENDATIONS.md  - Why we decided what we did
2. EXPLORATION_SUMMARY.md             - Technical findings
```

**Step 2:** Understand the patterns
```
3. PATTERNS_VISUAL_GUIDE.md           - How to integrate OpenTui with Effect
```

**Step 3:** Study the API
```
4. OPENTUI_EXPLORATION.md             - Complete API reference
```

**Step 4:** Review the code
```
Original code examples (in git history):
- poc-select.ts   - SelectRenderable integration
- poc-input.ts    - InputRenderable integration
- poc-combined.ts - Multi-prompt workflow
```

### Check OpenTui Status

Before reconsidering OpenTui, check:
1. Version - Is it v1.0.0+ now?
2. Documentation - Is it comprehensive?
3. Community - Is there active maintenance?
4. Breaking Changes - Any API stability?

Only proceed if:
- ✅ OpenTui is v1.0.0+
- ✅ Production-ready claim
- ✅ Good documentation
- ✅ Active community

---

## Code Examples (Preserved in Git)

The original POC code demonstrated these patterns:

### Pattern 1: Simple Wrapper
```typescript
function selectPrompt<T>(
  options,
  title
): Effect.Effect<T, Error> {
  return Effect.promise(() =>
    new Promise(async (resolve, reject) => {
      const renderer = await createCliRenderer()
      const select = new SelectRenderable(renderer, { options, ... })
      renderer.root.add(select)
      select.on('itemSelected', () => {
        const value = select.getSelectedOption()?.value
        renderer.stop()
        resolve(value)
      })
      renderer.start()
    })
  )
}
```

### Pattern 2: Sequential Composition
```typescript
const workflow = Effect.gen(function* (_) {
  const framework = yield* _(selectPrompt(frameworks))
  const name = yield* _(inputPrompt('Name:'))
  const version = yield* _(inputPrompt('Version:'))
  
  return { framework, name, version }
})
```

These patterns are generic and applicable to any imperative TUI library.

---

## Next Phase: Ink Exploration

We are now evaluating **Ink** as the primary TUI framework because:

**Ink Advantages:**
- ✅ Production-proven (Claude, Copilot, GitHub CLI, etc.)
- ✅ React-based component model
- ✅ Excellent TypeScript support
- ✅ Rich UI capabilities
- ✅ Active maintenance
- ✅ Large community

**Ink vs OpenTui:**

| Aspect | OpenTui | Ink |
|--------|---------|-----|
| Status | Alpha (0.1.30) | Production (v4+) |
| Component Model | Imperative | React (Declarative) |
| Learning Curve | High | Medium (React knowledge) |
| Production Ready | ❌ No | ✅ Yes |
| Community | Small | Large |
| Documentation | Sparse | Excellent |

See: `docs/` for Ink exploration POC (coming next)

---

## Archive Status

**Ink vs OpenTui:**

| Aspect | OpenTui | Ink |
|--------|---------|-----|
| Status | Alpha (0.1.30) | Production (v4+) |
| Component Model | Imperative | React (Declarative) |
| Learning Curve | High | Medium (React knowledge) |
| Production Ready | ❌ No | ✅ Yes |
| Community | Small | Large |
| Documentation | Sparse | Excellent |

---

## Archive Status

---

## Archive Status

This archive is **permanent reference material**. It will not be deleted or updated.

**Use for:**
- Understanding how we evaluated OpenTui
- Reference for imperative-to-Effect wrapping
- Decision history and rationale
- Fallback if Ink doesn't work out

**Do not use for:**
- Production OpenTui integration (v1)
- New feature development (use @inquirer instead)
- Current implementation (use Ink POC instead)

---

## Quick Facts

- **Exploration Time:** October 25, 2025
- **Documentation:** 7 files, 2,393 lines
- **Code Examples:** 3 working examples, 390 lines
- **Decision:** ✅ Use @inquirer for v1, OpenTui for v2+ if needed
- **Next:** Ink evaluation underway

---

## Related Documents

- Root README.md - Project overview (updated with decision)
- docs/PHASE_TRANSITION.md - Transition notes from OpenTui to Ink
- docs/ - Main documentation directory

---

**Questions about OpenTui?** See IMPLEMENTATION_RECOMMENDATIONS.md Q&A section.

**Ready to move forward?** Start exploring Ink in the main docs/ directory.

🚀 **Lesson Learned:** The real need is a full UI framework, not just prompts. This insight led us to Ink.
