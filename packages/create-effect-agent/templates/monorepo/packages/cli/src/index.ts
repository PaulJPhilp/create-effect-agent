import * as core from '@{{projectName}}/core'
import { Command } from 'commander'
import { Console, Effect } from 'effect'

const program = new Command()

program
    .name('{{projectName}}')
    .description('CLI application built with Effect-TS')
    .version(core.version)

program
    .command('hello [name]')
    .description('Say hello')
    .action((name = 'World') => {
        const greet = Effect.gen(function* (_) {
            const message = core.greet(name)
            yield* _(Console.log(message))
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
