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

## Styling hooks

| Attribute                         | Element                     | Notes                          |
| --------------------------------- | --------------------------- | ------------------------------ |
| `data-component="step-indicator"` | Root                        | Scope styles to this component |
| `data-part="label"`               | Label element               | —                              |
| `data-part="progress"`            | Progress bar and step count | —                              |

## Examples

### Basic button

```html
...
```
