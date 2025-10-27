import * as Effect from 'effect/Effect'
import { GenerateConfig, ValidateError, FileError } from '../../types.js'
import { generateProject } from '../generate.js'

/**
 * Generate command handler
 */
export const generate = (config: GenerateConfig): Effect.Effect<void, ValidateError | FileError> =>
  Effect.gen(function* (_) {
    yield* _(generateProject(config))
  })
