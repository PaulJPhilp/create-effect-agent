export const RESERVED_NAMES = [
    'effect',
    'node_modules',
    'package',
    'test',
    'lib',
    'src',
    'dist',
    'build',
    'create-effect-agent'
]

export const DEFAULT_TEMPLATE = 'basic'
export const DEFAULT_AGENTS = ['claude']
export const DEFAULT_LIBRARIES: string[] = []
export const DEFAULT_IDE_RULES = ['vscode']

export const ECOSYSTEM_LIBRARIES = {
    'effect-end': {
        version: '^0.0.1',
        description: 'Effects for HTTP'
    },
    'effect-mdx': {
        version: '^0.0.1',
        description: 'MDX utilities'
    },
    'effect-regex': {
        version: '^0.0.1',
        description: 'Regex utilities'
    }
}

export const SUPPORTED_AGENTS = ['claude', 'gemini', 'openai']
export const SUPPORTED_IDES = ['cursor', 'vscode', 'windsurf']
export const SUPPORTED_TEMPLATES = ['basic', 'cli', 'monorepo']

// Template variable defaults
export const TEMPLATE_VARIABLES = {
    projectName: {
        description: 'Project name',
        validate: (val: string) => /^[a-z0-9-]+$/.test(val)
    },
    projectDescription: {
        description: 'Project description',
        default: 'An agentic Effect project'
    },
    author: {
        description: 'Author name',
        default: ''
    }
}
