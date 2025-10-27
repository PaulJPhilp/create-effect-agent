export * as Effect from 'effect/Effect'
export * from './supermemory/example'

/**
 * Example Effect function
 */
export const greet = (name: string): Effect.Effect<string> =>
  Effect.sync(() => `Hello, ${name}! Welcome to ${projectName}.`)

/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('${projectName}'))
  console.log(message)
})
