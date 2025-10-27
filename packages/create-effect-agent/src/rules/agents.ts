import { FullConfig, FileContent } from '../types.js'

/**
 * Generate agent-specific documentation
 */
export const generateAgentDocs = (config: FullConfig, agent: string): FileContent => {
  const content = `# ${agent} Guidelines for ${config.name}

## Project Overview
${config.name} is a ${config.effectPack !== 'none' ? config.effectPack + ' level ' : ''}Effect-TS library${config.ruleFormats.length > 0 ? ' with agentic development support' : ''}.

## Effect Programming

### Key Patterns to Follow
${config.effectPack === 'Senior' ? `- **Error Taxonomy**: Define custom TaggedError classes for domain errors
- **Service Pattern**: Use Effect.Service for external dependencies
- **Composition**: Combine effects using Effect.gen, Effect.all, and Effect.race` : ''}

${config.effectPack === 'Intermediate' ? `- **Services**: Implement Effect.Services with Layer-based dependency injection
- **Error Handling**: Use Effect.catchTag for specific error recovery
- **Composition**: Chain effects with flatMap and gen functions` : ''}

${config.effectPack === 'Junior' ? `- **Basic Effects**: Use Effect.sync for pure functions
- **Async Effects**: Wrap promises with Effect.tryPromise
- **Composition**: Chain operations with Effect.flatMap` : ''}

### Code Style
- Use TypeScript strict mode
- Prefer readonly interfaces and branded types
- Write comprehensive tests with Vitest
- Format code with Prettier

## Development Workflow

### Local Development
\`\`\`bash
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} test
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} build
${config.packageManager} ${config.packageManager === 'npm' ? 'run' : ''} typecheck
\`\`\`

### Key Files
- \`src/index.ts\` - Main library exports and examples
- \`test/index.test.ts\` - Test suite
- \`tsconfig.json\` - TypeScript configuration
- \`vitest.config.ts\` - Test runner configuration

## Best Practices

1. **Type Safety**: Leverage TypeScript's type system fully
2. **Effect Discipline**: All side effects go through Effect
3. **Error Boundaries**: Handle errors explicitly at appropriate levels
4. **Testing**: Test both success and failure paths
5. **Documentation**: Keep code self-documenting with clear names

## ${agent} Specific Tips

${agent === 'Claude' ? `**Claude**: Focus on understanding the Effect composition patterns. Ask for clarification on complex type signatures and effect composition.` : ''}

${agent === 'OpenAI' ? `**OpenAI**: Pay attention to the functional programming paradigm. Effect is about composing computations, not imperative control flow.` : ''}

${agent === 'Gemini' ? `**Gemini**: Study the error handling patterns carefully. TaggedError classes enable type-safe error discrimination.` : ''}
`

  return {
    [`docs/agents/${agent}.md`]: content
  }
}
