import { FullConfig, FileContent } from '../types.js'

/**
 * Generate Cursor rules file
 */
export const generateCursorRules = (config: FullConfig): FileContent => ({
  '.cursor/rules/agent.md': `# Agent Rules for ${config.name}

## Project Context
This is a ${config.name} Effect-TS library${config.effectPack !== 'none' ? ` demonstrating ${config.effectPack} level patterns` : ''}.

## Effect Patterns
${config.effectPack === 'Senior' ? '- Use proper error taxonomy with TaggedError classes\n- Implement Effect.Services for external dependencies\n- Compose effects using Effect.gen and Effect.all' : ''}
${config.effectPack === 'Intermediate' ? '- Use Effect.Services and Layers for dependency injection\n- Handle errors explicitly with Effect.catchTag' : ''}
${config.effectPack === 'Junior' ? '- Use Effect.sync for pure computations\n- Use Effect.tryPromise for async operations\n- Chain effects with Effect.flatMap' : ''}

## TypeScript Guidelines
${config.typeScriptPack === 'front-end' ? '- Include DOM types for browser APIs\n- Use JSX when appropriate' : ''}
${config.typeScriptPack === 'back-end' ? '- Exclude DOM types for Node.js environment\n- Use Node.js types for server-side APIs' : ''}
- Use strict TypeScript settings
- Prefer readonly interfaces
- Use branded types for domain-specific values

## Testing
- Write tests for all non-trivial functions
- Use Effect.runSync for simple effect testing
- Test error cases explicitly
`
})
