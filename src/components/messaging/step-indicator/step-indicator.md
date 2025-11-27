# `step-indicator`

Display the user's current progress through a discrete number of steps.

## Slots

### `default`

The name of the current step.

### `current-step`

- default: `Step {{ currentStep }} of {{ stepCount }}`

The indicator for the current step.

## Props

### `currentStep`

- type: `number`
- default: `1`

The user's current step.

### `stepCount`

- type: `number`

The number of steps that the user can expect in this workflow.

## Examples

### Basic button

```html
...
```
