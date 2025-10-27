import { Effect, Layer } from 'effect'
import { Supermemory, SupermemoryConfig } from 'effect-supermemory'

// Define the Supermemory configuration for the layer
const SupermemoryConfigLive = Layer.succeed(
  SupermemoryConfig,
  SupermemoryConfig.of({
    apiKey: process.env.SUPERMEMORY_API_KEY || '' // Placeholder for API key
  })
)

// Create a Supermemory layer with retries
export const SupermemoryLive = SupermemoryConfigLive.pipe(
  Layer.provide(Supermemory.Live),
  Layer.use(Supermemory.with  // Assuming Supermemory.with is the correct way to add retries
    Effect.retry({ times: 3, schedule: Effect.scheduleExponential(100) })
  )
)

// Example Effect that uses Supermemory
export const exampleSupermemoryEffect = (query: string) =>
  Effect.gen(function* (_) {
    const supermemory = yield* _(Supermemory.Supermemory)
    // In a real application, you would use supermemory.query or other methods
    // This is a placeholder to demonstrate wiring
    yield* _(Effect.log(`Querying Supermemory with: ${query}`))
    return `Response for: ${query}`
  }).pipe(Effect.provide(SupermemoryLive))
