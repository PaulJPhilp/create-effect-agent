import * as Effect from 'effect/Effect'
import { FullConfig, FileContent } from '../types.js'
import { generateCursorRules } from './cursor.js'
import { generateVSCodeSettings } from './vscode.js'
import { generateWindsurfRules } from './windsurf.js'
import { generateAgentDocs } from './agents.js'
import { generateAgentsMd } from './agents-md.js'

/**
 * Generate rules files based on selected formats
 */
export const generateRulesFiles = (config: FullConfig): Effect.Effect<FileContent, never> =>
  Effect.gen(function* (_) {
    const files: FileContent = {}

    for (const format of config.ruleFormats) {
      switch (format) {
        case 'Cursor':
          Object.assign(files, generateCursorRules(config))
          break
        case 'VS Code':
          Object.assign(files, generateVSCodeSettings(config))
          break
        case 'Windsurf':
          Object.assign(files, generateWindsurfRules(config))
          break
        case 'Claude':
          Object.assign(files, generateAgentDocs(config, 'Claude'))
          break
        case 'OpenAI':
          Object.assign(files, generateAgentDocs(config, 'OpenAI'))
          break
        case 'Gemini':
          Object.assign(files, generateAgentDocs(config, 'Gemini'))
          break
        case 'Agents.md':
          Object.assign(files, generateAgentsMd(config))
          break
      }
    }

    return files
  })
