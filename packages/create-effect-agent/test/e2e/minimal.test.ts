import { describe, it, expect } from 'vitest'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as childProcess from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(childProcess.exec)

describe('E2E: Minimal basic template', () => {
  const testDir = path.join(process.cwd(), 'test-output-minimal')

  it('should generate project successfully', async () => {
    // Clean up
    await fs.rm(testDir, { recursive: true, force: true })

    // Generate project
    const { stdout } = await exec(`node bin/create-effect-agent generate ${testDir} --name test-lib --yes --no-git`, {
      cwd: process.cwd()
    })

    expect(stdout).toContain('Minimal Effect library created')

    // Verify directory structure
    const entries = await fs.readdir(testDir)
    expect(entries).toContain('package.json')
    expect(entries).toContain('src')
    expect(entries).toContain('test')
    expect(entries).toContain('tsconfig.json')
    expect(entries).toContain('README.md')
  })

  it('should install dependencies', async () => {
    await exec('pnpm install', { cwd: testDir })
    await fs.access(path.join(testDir, 'node_modules'))
  })

  it('should pass typecheck', async () => {
    await exec('pnpm typecheck', { cwd: testDir })
  })

  it('should build successfully', async () => {
    await exec('pnpm build', { cwd: testDir })
    await fs.access(path.join(testDir, 'dist'))
    await fs.access(path.join(testDir, 'dist/index.js'))
    await fs.access(path.join(testDir, 'dist/index.d.ts'))
  })

  it('should run tests', async () => {
    const { stdout } = await exec('pnpm test', { cwd: testDir })
    expect(stdout).toContain('2 passed')
  })
})
