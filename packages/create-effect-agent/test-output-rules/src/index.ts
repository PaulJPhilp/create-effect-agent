import * as Effect from 'effect/Effect'

/**
 * Example Effect function
 */
export const greet = (name: string): Effect.Effect<string> =>
  Effect.sync(() => `Hello, ${name}! Welcome to test-lib.`)


/**
 * Example program using the greet function
 */
export const main: Effect.Effect<void> = Effect.gen(function* (_) {
  const message = yield* _(greet('test-lib'))
  console.log(message)
})

// Export the Effect runtime for convenience
export { Effect } from 'effect/Effect'
