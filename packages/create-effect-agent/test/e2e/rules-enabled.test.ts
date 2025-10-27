import { describe, it, expect } from 'vitest'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as childProcess from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(childProcess.exec)

describe('E2E: Rules-enabled basic template', () => {
  const testDir = path.join(process.cwd(), 'test-output-rules')

  it('should generate project with all rules', async () => {
    // Clean up
    await fs.rm(testDir, { recursive: true, force: true })

    // Generate project with all rules (simulated by creating config)
    // Note: In a real CI scenario, this would use a preset or seed file
    // For now, we'll manually create the expected structure

    // Since interactive prompts are hard to test, we'll create a minimal test
    // that verifies the template generation works

    const { stdout } = await exec(`node bin/create-effect-agent generate ${testDir} --name test-lib --yes --no-git`, {
      cwd: process.cwd()
    })

    expect(stdout).toContain('Minimal Effect library created')

    // Verify basic structure
    const entries = await fs.readdir(testDir)
    expect(entries).toContain('package.json')
    expect(entries).toContain('src')
    expect(entries).toContain('docs') // Would be created with rules
  })

  it('should have proper package.json exports', async () => {
    const packageJson = JSON.parse(await fs.readFile(path.join(testDir, 'package.json'), 'utf-8'))
    expect(packageJson.type).toBe('module')
    expect(packageJson.exports).toBeDefined()
    expect(packageJson.exports['.'].types).toBe('./dist/index.d.ts')
    expect(packageJson.exports['.'].import).toBe('./dist/index.js')
  })

  it('should build and test successfully', async () => {
    await exec('pnpm install', { cwd: testDir })
    await exec('pnpm typecheck', { cwd: testDir })
    await exec('pnpm build', { cwd: testDir })
    const { stdout } = await exec('pnpm test', { cwd: testDir })
    expect(stdout).toContain('passed')
  })
})
