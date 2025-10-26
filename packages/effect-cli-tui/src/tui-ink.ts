import * as Effect from 'effect/Effect'
import React from 'react'
import {
    ConfirmScreen,
    FormFlow,
    InputScreen,
    SelectScreen,
} from './components/ink'
import {
    InkError,
    renderInkWithResult
} from './effects/ink-wrapper'
import { FormFlowConfig } from './types/ink-types'

/**
 * Ink-based TUI Handler
 *
 * Provides rich terminal UIs using React and Ink
 * Designed to coexist with existing @inquirer/prompts TUIHandler
 * Both can be used together for different use cases
 */
export class InkTUIHandler {
    /**
     * Multi-screen form workflow
     *
     * Preserves context across screens and accumulates form data
     * Ideal for complex workflows requiring multiple input steps
     *
     * @param config Form flow configuration with screens
     * @returns Effect that resolves with the collected form data
     *
     * @example
     * const result = yield* _(
     *   tui.formFlow({
     *     title: 'User Setup',
     *     screens: [
     *       { id: 'name', title: 'Name', component: NameScreen },
     *       { id: 'email', title: 'Email', component: EmailScreen },
     *     ],
     *   })
     * )
     */
    formFlow<T extends Record<string, unknown>>(
        config: FormFlowConfig<T>
    ): Effect.Effect<T, InkError> {
        return renderInkWithResult<T>((onComplete: (value: T) => void) =>
            React.createElement(FormFlow as any, {
                ...config,
                onComplete,
            })
        )
    }

    /**
     * Select from options
     *
     * Display a list of options with optional descriptions
     * Navigate with arrow keys, select with Enter
     *
     * @param message Display message
     * @param options Array of selectable options
     * @returns Effect that resolves with the selected value
     *
     * @example
     * const choice = yield* _(
     *   tui.selectOption('Choose an option', [
     *     { label: 'Option A', value: 'a', description: 'First option' },
     *     { label: 'Option B', value: 'b', description: 'Second option' },
     *   ])
     * )
     */
    selectOption<T>(
        message: string,
        options: Array<{ label: string; value: T; description?: string }>
    ): Effect.Effect<T, InkError> {
        return renderInkWithResult<T>((onSelect: (value: T) => void) =>
            React.createElement(SelectScreen as any, {
                title: message,
                options,
                onNext: onSelect,
            })
        )
    }

    /**
     * Text input prompt
     *
     * Display a text input field with optional validation
     *
     * @param prompt Display prompt text
     * @param defaultValue Default input value
     * @param validate Optional validation function
     * @returns Effect that resolves with the user input
     *
     * @example
     * const name = yield* _(
     *   tui.inputPrompt('Enter your name', '', (v) => v.length > 0 || 'Name required')
     * )
     */
    inputPrompt(
        prompt: string,
        defaultValue?: string,
        validate?: (value: string) => boolean | string
    ): Effect.Effect<string, InkError> {
        return renderInkWithResult<string>((onNext: (value: string) => void) =>
            React.createElement(InputScreen as any, {
                title: '',
                prompt,
                defaultValue,
                validate,
                onNext,
            })
        )
    }

    /**
     * Confirmation dialog
     *
     * Display a yes/no confirmation dialog
     * Navigate with arrow keys, confirm with Enter
     *
     * @param message Message to display
     * @param title Optional dialog title
     * @returns Effect that resolves with true (confirm) or false (cancel)
     *
     * @example
     * const confirmed = yield* _(
     *   tui.confirm('Are you sure?', 'Confirm Action')
     * )
     */
    confirm(
        message: string,
        title: string = 'Confirm'
    ): Effect.Effect<boolean, InkError> {
        return renderInkWithResult<boolean>((onComplete: (value: boolean) => void) =>
            React.createElement(ConfirmScreen as any, {
                title,
                message,
                onConfirm: () => onComplete(true),
                onCancel: () => onComplete(false),
            })
        )
    }
}
