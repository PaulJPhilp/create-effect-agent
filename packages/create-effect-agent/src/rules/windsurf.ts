import { FullConfig, FileContent } from '../types.js'

/**
 * Generate Windsurf rules file
 */
export const generateWindsurfRules = (config: FullConfig): FileContent => ({
  '.windsurf/rules.md': `# Development Guidelines for ${config.name}

## Effect Programming Patterns

### Core Principles
- **Type Safety First**: Leverage TypeScript's strict mode for compile-time guarantees
- **Effect Everything**: Wrap all side effects in Effect for composability and testability
- **Explicit Errors**: Use TaggedError classes for discriminated unions

### Effect Levels
${config.effectPack === 'Junior' ? `
#### Junior Patterns
- Use \`Effect.sync\` for pure computations
- Use \`Effect.tryPromise\` for async operations
- Chain with \`Effect.flatMap\` and \`Effect.gen\`
` : ''}

${config.effectPack === 'Intermediate' ? `
#### Intermediate Patterns
- Implement Effect.Services for dependency injection
- Use Layers to provide service implementations
- Handle errors with \`Effect.catchTag\` for specific error types
` : ''}

${config.effectPack === 'Senior' ? `
#### Senior Patterns
- Design error taxonomies with TaggedError hierarchies
- Compose complex effects using Effect.all and Effect.race
- Implement custom Effect operators for domain-specific logic
` : ''}

## TypeScript Configuration

${config.typeScriptPack === 'front-end' ? `
### Front-end Specific
- Include DOM and DOM.Iterable lib types
- Configure JSX support in tsconfig.json
- Use React types when appropriate
` : ''}

${config.typeScriptPack === 'back-end' ? `
### Back-end Specific
- Exclude DOM lib types
- Include Node.js types for server APIs
- Focus on server-side type safety
` : ''}

## Testing Strategy
- Test all public APIs
- Use \`Effect.runSync\` for pure effects
- Mock Effect.Services in tests
- Test error conditions explicitly
`
})
