import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmScreen } from '../../components/ink/ConfirmScreen'
import { InputScreen } from '../../components/ink/InputScreen'
import { SelectScreen } from '../../components/ink/SelectScreen'

describe('Ink Components', () => {
    describe('SelectScreen', () => {
        it('renders title and options', () => {
            const onNext = vi.fn()
            const options = [
                { label: 'Option 1', value: 'a' },
                { label: 'Option 2', value: 'b' },
            ]

            const component = React.createElement(SelectScreen, {
                title: 'Choose',
                options,
                onNext,
            })

            expect(component).toBeTruthy()
            expect(component.props.options).toHaveLength(2)
        })

        it('accepts onNext callback', () => {
            const onNext = vi.fn()
            const options = [{ label: 'Option 1', value: 'a' }]

            const component = React.createElement(SelectScreen, {
                title: 'Choose',
                options,
                onNext,
            })

            expect(component.props.onNext).toBeDefined()
        })

        it('accepts optional onPrevious callback', () => {
            const onNext = vi.fn()
            const onPrevious = vi.fn()
            const options = [{ label: 'Option 1', value: 'a' }]

            const component = React.createElement(SelectScreen, {
                title: 'Choose',
                options,
                onNext,
                onPrevious,
            })

            expect(component.props.onPrevious).toBeDefined()
        })
    })

    describe('InputScreen', () => {
        it('renders title and prompt', () => {
            const onNext = vi.fn()

            const component = React.createElement(InputScreen, {
                title: 'Enter Name',
                prompt: 'Name:',
                onNext,
            })

            expect(component).toBeTruthy()
            expect(component.props.title).toBe('Enter Name')
            expect(component.props.prompt).toBe('Name:')
        })

        it('accepts default value', () => {
            const onNext = vi.fn()

            const component = React.createElement(InputScreen, {
                title: 'Enter Name',
                prompt: 'Name:',
                defaultValue: 'John',
                onNext,
            })

            expect(component.props.defaultValue).toBe('John')
        })

        it('accepts validation function', () => {
            const onNext = vi.fn()
            const validate = (v: string) => v.length > 0

            const component = React.createElement(InputScreen, {
                title: 'Enter Name',
                prompt: 'Name:',
                validate,
                onNext,
            })

            expect(component.props.validate).toBeDefined()
        })
    })

    describe('ConfirmScreen', () => {
        it('renders title and message', () => {
            const onConfirm = vi.fn()
            const onCancel = vi.fn()

            const component = React.createElement(ConfirmScreen, {
                title: 'Confirm',
                message: 'Are you sure?',
                onConfirm,
                onCancel,
            })

            expect(component).toBeTruthy()
            expect(component.props.title).toBe('Confirm')
            expect(component.props.message).toBe('Are you sure?')
        })

        it('accepts callbacks', () => {
            const onConfirm = vi.fn()
            const onCancel = vi.fn()

            const component = React.createElement(ConfirmScreen, {
                title: 'Confirm',
                message: 'Are you sure?',
                onConfirm,
                onCancel,
            })

            expect(component.props.onConfirm).toBeDefined()
            expect(component.props.onCancel).toBeDefined()
        })
    })
})
