import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import React, { useState } from 'react'

export interface InputScreenProps {
    title: string
    prompt: string
    defaultValue?: string
    validate?: (value: string) => boolean | string
    onNext: (value: string) => void
    onPrevious?: () => void
}

/**
 * Reusable input screen component
 * Allows text input with optional validation
 */
export function InputScreen({
    title,
    prompt,
    defaultValue = '',
    validate,
    onNext,
    onPrevious,
}: InputScreenProps): React.ReactElement {
    const [value, setValue] = useState(defaultValue)
    const [error, setError] = useState<string>()

    const handleSubmit = (val: string) => {
        if (validate) {
            const result = validate(val)
            if (result !== true) {
                setError(typeof result === 'string' ? result : 'Invalid input')
                return
            }
        }
        onNext(val)
    }

    return (
        <Box flexDirection="column" padding={1} gap={1}>
            <Text bold color="cyan">
                {title}
            </Text>

            <Box>
                <Text>{prompt} </Text>
                <TextInput
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    placeholder={defaultValue}
                />
            </Box>

            {error && <Text color="red">✗ {error}</Text>}

            <Text dimColor>
                Enter Submit{onPrevious ? ' • Ctrl+C Back' : ''}
            </Text>
        </Box>
    )
}
