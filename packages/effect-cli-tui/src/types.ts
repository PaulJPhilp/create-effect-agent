import * as Data from 'effect/Data'

export type TemplateType = 'basic' | 'cli' | 'monorepo'
export type Agent = 'claude' | 'gemini' | 'openai'
export type IDE = 'cursor' | 'vscode' | 'windsurf'
export type Library =
    | 'effect-end'
    | 'effect-mdx'
    | 'effect-regex'

export interface CLIConfig {
    projectName: string
    projectPath: string
    template: TemplateType
    agents: Agent[]
    libraries: Library[]
    ideRules: IDE[]
    setupLinting: boolean
    setupGit: boolean
}

export interface SelectOption {
    label: string
    value: string
    description?: string
}

export interface CLIResult {
    exitCode: number
    stdout: string
    stderr: string
}

export interface CLIRunOptions {
    cwd?: string
    env?: Record<string, string>
    timeout?: number
}

export interface PromptOptions {
    default?: string
    validate?: (input: string) => boolean | string
}// Error types
export class CLIError extends Data.TaggedError('CLIError') {
    constructor(
        readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound',
        readonly message: string
    ) {
        super()
    }
}

export class TUIError extends Data.TaggedError('TUIError') {
    constructor(
        readonly reason: 'Cancelled' | 'ValidationFailed' | 'RenderError',
        readonly message: string
    ) {
        super()
    }
}
