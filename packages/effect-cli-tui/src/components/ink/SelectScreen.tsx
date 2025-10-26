import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'

export interface SelectScreenProps<T> {
    title: string
    options: Array<{
        label: string
        value: T
        description?: string
    }>
    onNext: (value: T) => void
    onPrevious?: () => void
}

/**
 * Reusable select screen component
 * Allows navigation with arrow keys and selection with Enter
 */
export function SelectScreen<T>({
    title,
    options,
    onNext,
    onPrevious,
}: SelectScreenProps<T>): React.ReactElement {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex((i: number) => Math.max(0, i - 1))
        }
        if (key.downArrow) {
            setSelectedIndex((i: number) => Math.min(options.length - 1, i + 1))
        }
        if (key.return) {
            onNext(options[selectedIndex].value)
        }
        if (key.escape && onPrevious) {
            onPrevious()
        }
    })

    return (
        <Box flexDirection="column" padding={1} gap={1}>
            <Text bold color="cyan">
                {title}
            </Text>

            <Box flexDirection="column" gap={0}>
                {options.map((option, i) => (
                    <Box key={i}>
                        <Text color={i === selectedIndex ? 'green' : undefined}>
                            {i === selectedIndex ? '❯ ' : '  '}
                            {option.label}
                        </Text>
                        {option.description && i === selectedIndex && (
                            <Text dimColor> — {option.description}</Text>
                        )}
                    </Box>
                ))}
            </Box>

            <Text dimColor>
                ↑↓ Navigate • Enter Select
                {onPrevious ? ' • Esc Back' : ''}
            </Text>
        </Box>
    )
}
