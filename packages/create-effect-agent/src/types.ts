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

export type PackageManager = 'npm' | 'pnpm' | 'bun'
export type RuleFormat = 'Cursor' | 'VS Code' | 'Windsurf' | 'Claude' | 'OpenAI' | 'Gemini' | 'Agents.md'
export type TypeScriptPack = 'back-end' | 'front-end' | 'none'
export type EffectPack = 'Junior' | 'Intermediate' | 'Senior' | 'none'

export interface GenerateConfig {
    path: string
    name?: string
    yes: boolean
    noGit: boolean
}

export interface FullConfig extends GenerateConfig {
    packageManager: PackageManager
    template: 'basic'
    ruleFormats: RuleFormat[]
    typeScriptPack: TypeScriptPack
    effectPack: EffectPack
}

export interface GeneratedProject {
    name: string
    path: string
    config: CLIConfig
    generatedAt: Date
}

export interface TemplateFile {
    source: string
    destination: string
    isTemplate: boolean
}

export interface VariableDefinition {
    description: string
    default?: string
    validate?: (value: string) => boolean
}

export interface Template {
    name: string
    description: string
    files: TemplateFile[]
    variables: Record<string, VariableDefinition>
}

export type FileContent = Record<string, string>

// Error types
export class InitError extends Data.TaggedError('InitError') {
    constructor(readonly message: string) {
        super()
    }
}

export class GenerateError extends Data.TaggedError('GenerateError') {
    constructor(
        readonly message: string,
        readonly step: 'template' | 'rules' | 'install' | 'git' | 'lint',
        readonly context?: Record<string, unknown>
    ) {
        super()
    }
}

export class ValidateError extends Data.TaggedError('ValidateError') {
    constructor(readonly message: string) {
        super()
    }
}

export class FileError extends Data.TaggedError('FileError') {
    constructor(readonly message: string) {
        super()
    }
}

export class TemplateError extends Data.TaggedError('TemplateError') {
    constructor(readonly message: string) {
        super()
    }
}

export class GitError extends Data.TaggedError('GitError') {
    constructor(readonly message: string) {
        super()
    }
}

export class LintingError extends Data.TaggedError('LintingError') {
    constructor(readonly message: string) {
        super()
    }
}
