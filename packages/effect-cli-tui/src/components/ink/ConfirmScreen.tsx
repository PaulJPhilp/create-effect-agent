import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'

export interface ConfirmScreenProps {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

/**
 * Reusable confirmation screen component
 * Allows yes/no selection with arrow keys
 */
export function ConfirmScreen({
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmScreenProps): React.ReactElement {
    const [selected, setSelected] = useState<'yes' | 'no'>('yes')

    useInput((input, key) => {
        if (key.leftArrow || key.rightArrow) {
            setSelected(selected === 'yes' ? 'no' : 'yes')
        }
        if (key.return) {
            selected === 'yes' ? onConfirm() : onCancel()
        }
    })

    return (
        <Box flexDirection="column" padding={1} gap={1}>
            <Text bold color="cyan">
                {title}
            </Text>

            <Text>{message}</Text>

            <Box gap={2}>
                <Text
                    color={selected === 'yes' ? 'green' : undefined}
                    bold={selected === 'yes'}
                >
                    [Yes]
                </Text>
                <Text
                    color={selected === 'no' ? 'green' : undefined}
                    bold={selected === 'no'}
                >
                    [No]
                </Text>
            </Box>

            <Text dimColor>← → Navigate • Enter Confirm</Text>
        </Box>
    )
}
