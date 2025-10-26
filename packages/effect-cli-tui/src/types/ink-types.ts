import type React from 'react'

/**
 * Configuration for a single form screen
 */
export interface FormScreen<T = unknown> {
    id: string
    title: string
    component: React.ComponentType<{
        onNext: (value: T) => void
        onPrevious?: () => void
    }>
    validate?: (value: T) => boolean | string
}

/**
 * Form flow configuration
 */
export interface FormFlowConfig<T = Record<string, unknown>> {
    title?: string
    screens: FormScreen<any>[]
    onComplete?: (result: T) => void
}

/**
 * Dashboard item configuration
 */
export interface DashboardItem {
    id: string
    label: string
    value: string | number
    color?: string
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
    title: string
    items: DashboardItem[]
    refreshInterval?: number
}

/**
 * Select with preview option
 */
export interface SelectWithPreviewOption<T> {
    name: string
    value: T
    description?: string
    preview?: () => React.ReactElement
}

/**
 * Select with preview configuration
 */
export interface SelectWithPreviewConfig<T> {
    message: string
    options: SelectWithPreviewOption<T>[]
    onSelect: (value: T) => void
}
