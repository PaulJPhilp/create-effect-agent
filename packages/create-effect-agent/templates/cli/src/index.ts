import { Command } from 'commander'
import { Console, Effect } from 'effect'

const program = new Command()

program
    .name('{{projectName}}')
    .description('CLI application built with Effect-TS')
    .version('1.0.0')

// Example command
program
    .command('hello [name]')
    .description('Say hello')
    .action((name = 'World') => {
        const greet = Effect.gen(function* (_) {
            yield* _(Console.log(`Hello, ${name}!`))
        })

        Effect.runPromise(greet).catch((err) => {
            console.error('Error:', err)
            process.exit(1)
        })
    })

program.parse(process.argv)

if (process.argv.length < 3) {
    program.outputHelp()
}
