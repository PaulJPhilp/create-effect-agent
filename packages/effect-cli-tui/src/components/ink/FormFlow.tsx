import React, { useState } from 'react'
import { FormFlowConfig } from '../../types/ink-types'

export interface FormFlowProps<T> extends FormFlowConfig<T> {
    onComplete: (result: T) => void
}

/**
 * Multi-screen form flow component
 * Manages state and navigation across multiple screens
 * Accumulates form data and passes it to onComplete when done
 */
export function FormFlow<T extends Record<string, unknown>>({
    title,
    screens,
    onComplete,
}: FormFlowProps<T>): React.ReactElement {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
    const [formData, setFormData] = useState<T>({} as T)

    const currentScreen = screens[currentScreenIndex]
    const Screen = currentScreen.component

    const handleNext = (value: unknown) => {
        const newData = {
            ...formData,
            [currentScreen.id]: value,
        }
        setFormData(newData as T)

        if (currentScreenIndex < screens.length - 1) {
            setCurrentScreenIndex(currentScreenIndex + 1)
        } else {
            onComplete(newData)
        }
    }

    const handlePrevious = () => {
        if (currentScreenIndex > 0) {
            setCurrentScreenIndex(currentScreenIndex - 1)
        }
    }

    return React.createElement(Screen as any, {
        onNext: handleNext,
        onPrevious:
            currentScreenIndex > 0 ? handlePrevious : undefined,
    })
}
