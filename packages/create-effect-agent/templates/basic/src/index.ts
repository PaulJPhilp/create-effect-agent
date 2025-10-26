import * as Effect from 'effect/Effect'

// Example Effect program
const main: Effect.Effect<void, never> = Effect.sync(() => {
    console.log('🎉 Welcome to {{projectName}}!')
    console.log('Built with Effect-TS for composable, type-safe programming.')
})

// Run the program
Effect.runSync(main)
