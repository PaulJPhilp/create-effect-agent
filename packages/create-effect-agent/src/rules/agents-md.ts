import { FullConfig, FileContent } from '../types.js'

/**
 * Generate aggregated Agents.md with guidance for all selected agents
 */
export const generateAgentsMd = (config: FullConfig): FileContent => {
  const agents = config.ruleFormats.filter(format =>
    ['Claude', 'OpenAI', 'Gemini'].includes(format)
  )

  if (agents.length === 0) return {}

  const content = `# Agent Guidelines for ${config.name}

## Project Context
${config.name} is a ${config.effectPack !== 'none' ? config.effectPack + ' level ' : ''}Effect-TS library${config.ruleFormats.length > 0 ? ' with comprehensive development tooling' : ''}.

## Supported Agents
This project includes guidance for: ${agents.join(', ')}

## Core Principles

### Effect Programming
- **Functional Composition**: Effects compose like functions, not promises
- **Type Safety**: TypeScript strict mode catches errors at compile time
- **Explicit Errors**: TaggedError classes enable type-safe error handling
- **Dependency Injection**: Effect.Services with Layers provide testability

### Development Workflow
\`\`\`bash
# Test
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} test

# Build
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} build

# Type check
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} typecheck
\`\`\`

## Effect Patterns by Level

${config.effectPack === 'Junior' ? `
### Junior Level
- \`Effect.sync\` for pure computations
- \`Effect.tryPromise\` for async operations
- Basic effect chaining with \`flatMap\`
` : ''}

${config.effectPack === 'Intermediate' ? `
### Intermediate Level
- Effect.Services for dependency management
- Layer-based service provision
- Error discrimination with \`catchTag\`
- Effect composition with \`all\` and \`gen\`
` : ''}

${config.effectPack === 'Senior' ? `
### Senior Level
- Error taxonomy design with TaggedError hierarchies
- Complex effect composition and concurrency
- Custom operators and domain-specific effects
- Advanced service architectures
` : ''}

## Agent-Specific Guidance

${agents.includes('Claude') ? `
### Claude
- Focus on understanding Effect composition over imperative patterns
- Ask questions about type signatures and effect flows
- Study the service layer patterns carefully
` : ''}

${agents.includes('OpenAI') ? `
### OpenAI
- Remember: Effect ≠ Promise. Effects compose differently
- Pay attention to the functional programming paradigm
- Error handling is type-directed, not try/catch
` : ''}

${agents.includes('Gemini') ? `
### Gemini
- Study TaggedError patterns for type-safe error discrimination
- Understand Layer composition for dependency injection
- Focus on effect composition rather than control flow
` : ''}

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Exact optional properties
- Branded types for domain values

### Testing
- Vitest for all tests
- Test both success and error paths
- Mock services in integration tests
- Aim for comprehensive coverage

### Architecture
- Functional core with Effect boundary
- Service-oriented design
- Explicit error handling
- Type-safe APIs

## File Structure
- \`src/index.ts\` - Main library exports
- \`test/\` - Test suite
- \`tsconfig.json\` - TypeScript configuration
- \`vitest.config.ts\` - Test runner setup
- \`docs/agents/\` - Agent-specific guidance
`

  return {
    'docs/agents/Agents.md': content
  }
}
