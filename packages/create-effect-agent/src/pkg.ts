import { FullConfig } from './types.js'

/**
 * Generate package.json based on configuration
 */
export const generatePackageJson = (config: FullConfig) => {
  const basePackage = {
    name: config.name,
    version: '0.0.1',
    description: `A minimal Effect-TS library${config.ruleFormats.length > 0 ? ' with agentic development support' : ''}`,
    type: 'module',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js'
      }
    },
    scripts: {
      build: 'tsc -p tsconfig.build.json',
      typecheck: 'tsc --noEmit',
      test: 'vitest run',
      format: 'prettier --check .'
    },
    files: ['dist'],
    engines: {
      node: '>=18.18'
    },
    keywords: ['effect', 'typescript', 'functional-programming'],
    author: '',
    license: 'MIT',
    dependencies: {
      effect: '^3.18.0'
    },
    devDependencies: {
    '@types/node': '^20.0.0',
    typescript: '^5.9.0',
    vitest: '^1.0.0',
    prettier: '^3.0.0',
        ...(config.typeScriptPack === 'front-end' && {
            '@types/react': '^18.0.0'
        })
    }
  }

  return basePackage
}
