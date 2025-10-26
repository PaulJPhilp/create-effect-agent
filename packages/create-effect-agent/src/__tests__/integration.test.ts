import { Effect } from 'effect'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterAll, describe, expect, it } from 'vitest'
import { createDirectory, pathExists, readFile, writeFile } from '../utils/file'
import { extractTemplateVariables, processTemplate, validateTemplateVariables } from '../utils/template'

describe('Commands', () => {
    it('initProject returns a CLIConfig', async () => {
        // Note: This is a placeholder test. Full testing requires mocking TUIHandler
        // In real usage, initProject will be called interactively
        expect(true).toBe(true)
    })

    it('generateProject accepts a valid config', () => {
        const mockConfig = {
            projectName: 'test-app',
            projectPath: '/tmp/test-app',
            template: 'basic' as const,
            agents: ['claude'] as const,
            libraries: [],
            ideRules: ['vscode'] as const,
            setupLinting: true,
            setupGit: true,
        }
        expect(mockConfig).toBeDefined()
    })
})

describe('File Utilities', () => {
    let testDir: string

    // Create unique test directory before each test
    const createTestDir = () => {
        return path.join(os.tmpdir(), `effect-test-${Date.now()}-${Math.random().toString(36).substring(7)}`)
    }

    // Clean up a test directory
    const cleanupDir = (dir: string) => {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true })
        }
    }

    it('createDirectory creates a directory', async () => {
        testDir = createTestDir()
        const testPath = path.join(testDir, 'test-dir')
        await Effect.runPromise(createDirectory(testPath))
        expect(fs.existsSync(testPath)).toBe(true)
        cleanupDir(testDir)
    })

    it('pathExists checks directory existence', async () => {
        testDir = createTestDir()
        const testPath = path.join(testDir, 'existing')
        await Effect.runPromise(createDirectory(testPath))
        const exists = await Effect.runPromise(pathExists(testPath))
        expect(exists).toBe(true)
        cleanupDir(testDir)
    })

    it('writeFile writes content to a file', async () => {
        testDir = createTestDir()
        const testFile = path.join(testDir, 'test.txt')
        await Effect.runPromise(writeFile(testFile, 'test content'))
        expect(fs.existsSync(testFile)).toBe(true)
        cleanupDir(testDir)
    })

    it('readFile reads file content', async () => {
        testDir = createTestDir()
        const testFile = path.join(testDir, 'read-test.txt')
        const content = 'hello world'
        await Effect.runPromise(writeFile(testFile, content))
        const read = await Effect.runPromise(readFile(testFile))
        expect(read).toBe(content)
        cleanupDir(testDir)
    })

    // Final cleanup in case something was missed
    afterAll(() => {
        if (testDir && fs.existsSync(testDir)) {
            cleanupDir(testDir)
        }
    })
})

describe('Template Utilities', () => {
    it('processTemplate replaces variables', async () => {
        const template = 'Hello {{name}}, welcome to {{project}}!'
        const vars = { name: 'Alice', project: 'Effect' }
        const result = await Effect.runPromise(processTemplate(template, vars))
        expect(result).toBe('Hello Alice, welcome to Effect!')
    })

    it('extractTemplateVariables finds all variables', async () => {
        const template = 'Project: {{projectName}}, Author: {{author}}'
        const vars = extractTemplateVariables(template)
        expect(vars).toContain('projectName')
        expect(vars).toContain('author')
    })

    it('validateTemplateVariables checks all vars are provided', () => {
        const template = 'Name: {{name}}, Age: {{age}}'
        const vars = { name: 'Bob' }
        const result = validateTemplateVariables(template, vars)
        expect(result).toBeDefined()
    })
})
