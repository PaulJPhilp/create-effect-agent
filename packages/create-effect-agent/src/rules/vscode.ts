import { FullConfig, FileContent } from '../types.js'

/**
 * Generate VS Code settings
 */
export const generateVSCodeSettings = (config: FullConfig): FileContent => ({
  '.vscode/settings.json': JSON.stringify({
    'typescript.preferences.strict': true,
    'typescript.suggest.autoImports': true,
    'typescript.format.enable': true,
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': 'explicit',
      'source.organizeImports': 'explicit'
    },
    'typescript.preferences.includePackageJsonAutoImports': 'auto',
    'files.exclude': {
      'dist/': true,
      'node_modules/': true,
      '*.log': true
    }
  }, null, 2)
})
