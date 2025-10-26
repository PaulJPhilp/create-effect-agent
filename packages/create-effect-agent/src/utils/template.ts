import * as Effect from 'effect/Effect'
import { TemplateError } from '../types'

/**
 * Process template string by replacing {{variableName}} with values
 *
 * Example:
 *   processTemplate('Hello {{name}}, welcome to {{project}}', {
 *     name: 'Alice',
 *     project: 'Effect'
 *   })
 *   // => 'Hello Alice, welcome to Effect'
 */
export const processTemplate = (
    content: string,
    variables: Record<string, string>
): Effect.Effect<string, TemplateError> =>
    Effect.sync(() => {
        let result = content

        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`
            const regex = new RegExp(placeholder, 'g')
            result = result.replace(regex, value)
        }

        return result
    }).pipe(
        Effect.catchAll((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err)
            return Effect.fail(
                new TemplateError(
                    `Failed to process template: ${message}`
                )
            )
        })
    )

/**
 * Get all template variables from a template string
 *
 * Example:
 *   extractTemplateVariables('Hello {{name}}, welcome to {{project}}')
 *   // => ['name', 'project']
 */
export const extractTemplateVariables = (
    content: string
): string[] => {
    const regex = /\{\{(\w+)\}\}/g
    const variables: string[] = []
    let match

    while ((match = regex.exec(content)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1])
        }
    }

    return variables
}

/**
 * Validate that all required variables are provided
 */
export const validateTemplateVariables = (
    content: string,
    variables: Record<string, string>
): Effect.Effect<void, TemplateError> =>
    Effect.sync(() => {
        const required = extractTemplateVariables(content)
        const provided = Object.keys(variables)

        const missing = required.filter((v) => !provided.includes(v))

        if (missing.length > 0) {
            throw new TemplateError(
                `Missing template variables: ${missing.join(', ')}`
            )
        }
    }).pipe(
        Effect.catchAll((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err)
            return Effect.fail(
                new TemplateError(
                    `Failed to validate template variables: ${message}`
                )
            )
        })
    )
