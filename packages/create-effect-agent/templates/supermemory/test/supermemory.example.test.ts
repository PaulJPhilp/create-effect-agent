import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { Supermemory, SupermemoryConfig } from 'effect-supermemory'
import { exampleSupermemoryEffect } from '../src/supermemory/example'

describe('Supermemory Example', () => {
  it('should return a response for a given query (offline-safe)', () => {
    // Mock the Supermemory service to prevent actual network calls
    const MockSupermemoryLive = Layer.succeed(
      Supermemory.Supermemory,
      Supermemory.of({
        query: (query: string) => Effect.succeed(`Mocked response for: ${query}`),
        // Add other mocked methods as needed
      })
    )

    const program = exampleSupermemoryEffect('test query').pipe(
      Effect.provide(MockSupermemoryLive)
    )

    const result = Effect.runSync(program)
    expect(result).toBe('Response for: test query')
  })

  it('should use the provided API key from environment variables', () => {
    // Temporarily set an environment variable for testing
    process.env.SUPERMEMORY_API_KEY = 'test-api-key'

    const SupermemoryConfigLive = Layer.succeed(
      SupermemoryConfig,
      SupermemoryConfig.of({
        apiKey: process.env.SUPERMEMORY_API_KEY || ''
      })
    )

    const program = Effect.gen(function* (_) {
      const config = yield* _(SupermemoryConfig)
      return config.apiKey
    }).pipe(Effect.provide(SupermemoryConfigLive))

    const apiKey = Effect.runSync(program)
    expect(apiKey).toBe('test-api-key')

    // Clean up the environment variable
    delete process.env.SUPERMEMORY_API_KEY
  })
})
