import * as Effect from 'effect/Effect'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { ValidateError, FileError } from './types.js'

export interface FileContent {
  [filePath: string]: string
}

/**
 * Ensure directory exists and is empty
 */
export const ensureEmptyDir = (dirPath: string): Effect.Effect<void, ValidateError | FileError> =>
  Effect.gen(function* (_) {
    // Check if path exists and get stats
    const statEffect = Effect.tryPromise(() => fs.stat(dirPath))

    const statResult = yield* _(statEffect.pipe(
      Effect.match({
        onSuccess: (stats) => stats,
        onFailure: () => null
      })
    ))

    if (statResult !== null) {
      if (!statResult.isDirectory()) {
        return yield* _(Effect.fail(new ValidateError(
          `'${dirPath}' exists and is not a directory. Please choose another path.`
        )))
      }

      // Check if directory is empty
      const entries = yield* _(Effect.tryPromise({
        try: () => fs.readdir(dirPath),
        catch: (err) => {
          throw new FileError(`Failed to read directory ${dirPath}: ${err instanceof Error ? err.message : String(err)}`)
        }
      }))

      if (entries.length > 0) {
        return yield* _(Effect.fail(new ValidateError(
          `Directory '${dirPath}' is not empty. Please choose an empty directory or a different path.`
        )))
      }
    }

    // Create directory
    yield* _(Effect.tryPromise({
      try: () => fs.mkdir(dirPath, { recursive: true }),
      catch: (err) => {
        throw new FileError(`Failed to create directory ${dirPath}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }))
  })

/**
 * Write files to disk with token substitution
 */
export const writeFiles = (basePath: string, files: FileContent): Effect.Effect<void, FileError> =>
  Effect.gen(function* (_) {
    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = path.join(basePath, relativePath)
      const processedContent = substituteTokens(content, { basePath })

      yield* _(Effect.tryPromise({
        try: async () => {
          const dir = path.dirname(fullPath)
          await fs.mkdir(dir, { recursive: true })
          await fs.writeFile(fullPath, processedContent, 'utf-8')
        },
        catch: (err) => new FileError(
          `Failed to write file ${fullPath}: ${err instanceof Error ? err.message : String(err)}`
        )
      }))
    }
  })

/**
 * Substitute tokens in content
 */
const substituteTokens = (content: string, variables: Record<string, string>): string => {
  let result = content

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, 'g'), value)
  }

  return result
}
