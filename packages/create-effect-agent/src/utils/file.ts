import * as Effect from 'effect/Effect'
import * as fs from 'fs/promises'
import * as path from 'path'
import { FileError } from '../types.js'

/**
 * Create a directory and all parent directories recursively
 */
export const createDirectory = (
    dirPath: string
): Effect.Effect<void, FileError> =>
    Effect.tryPromise({
        try: () => fs.mkdir(dirPath, { recursive: true }),
        catch: (err) =>
            new FileError(
                `Failed to create directory ${dirPath}: ${err instanceof Error ? err.message : String(err)}`
            )
    })

/**
 * Check if a path exists
 */
export const pathExists = (
    filePath: string
): Effect.Effect<boolean, FileError> =>
    Effect.tryPromise({
        try: async () => {
            try {
                await fs.access(filePath)
                return true
            } catch {
                return false
            }
        },
        catch: (err) =>
            new FileError(
                `Failed to check path ${filePath}: ${err instanceof Error ? err.message : String(err)}`
            )
    })

/**
 * Copy a file from source to destination
 */
export const copyFile = (
    src: string,
    dest: string
): Effect.Effect<void, FileError> =>
    Effect.tryPromise({
        try: async () => {
            const destDir = path.dirname(dest)
            await fs.mkdir(destDir, { recursive: true })
            await fs.copyFile(src, dest)
        },
        catch: (err) =>
            new FileError(
                `Failed to copy file from ${src} to ${dest}: ${err instanceof Error ? err.message : String(err)}`
            )
    })

/**
 * Copy a directory recursively
 */
export const copyDirectory = (
    src: string,
    dest: string
): Effect.Effect<void, FileError> =>
    Effect.tryPromise({
        try: async () => {
            await fs.mkdir(dest, { recursive: true })
            const entries = await fs.readdir(src, { withFileTypes: true })

            for (const entry of entries) {
                const srcPath = path.join(src, entry.name)
                const destPath = path.join(dest, entry.name)

                if (entry.isDirectory()) {
                    await recursiveCopy(srcPath, destPath)
                } else {
                    await fs.copyFile(srcPath, destPath)
                }
            }
        },
        catch: (err) =>
            new FileError(
                `Failed to copy directory from ${src} to ${dest}: ${err instanceof Error ? err.message : String(err)}`
            )
    })

/**
 * Internal recursive copy helper
 */
async function recursiveCopy(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        if (entry.isDirectory()) {
            await recursiveCopy(srcPath, destPath)
        } else {
            await fs.copyFile(srcPath, destPath)
        }
    }
}

/**
 * Write content to a file
 */
export const writeFile = (
    filePath: string,
    content: string
): Effect.Effect<void, FileError> =>
    Effect.tryPromise({
        try: async () => {
            const dir = path.dirname(filePath)
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(filePath, content, 'utf-8')
        },
        catch: (err) =>
            new FileError(
                `Failed to write file ${filePath}: ${err instanceof Error ? err.message : String(err)}`
            )
    })

/**
 * Read file content as string
 */
export const readFile = (
    filePath: string
): Effect.Effect<string, FileError> =>
    Effect.tryPromise({
        try: () => fs.readFile(filePath, 'utf-8'),
        catch: (err) =>
            new FileError(
                `Failed to read file ${filePath}: ${err instanceof Error ? err.message : String(err)}`
            )
    })
