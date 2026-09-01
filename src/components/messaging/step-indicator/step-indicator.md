# `step-indicator`

Display the user's current progress through a discrete number of steps.

## Slots

### `default`

The label shown after the current-step text.

### `current-step`

- default: `Step {{ currentStep }} of {{ stepCount }}`

The current-step text shown before the label.

## Props

### `currentStep`

- type: `number`
- default: `1`

The user's current step.

### `stepCount`

- type: `number`

The number of steps that the user can expect in this workflow.

## Styling hooks

| Attribute                         | Element                                     | Notes                                |
| --------------------------------- | ------------------------------------------- | ------------------------------------ |
| `data-component="step-indicator"` | Root                                        | Scope styles to this component       |
| `data-part="label"`               | Label text                                  | Shown after the current-step text    |
| `data-part="progress"`            | Current-step text, label, and step segments | Text is shown above the segments     |
| `data-part="segment"`             | Individual step segment                     | `data-complete` is `true` or `false` |

## Examples

### Basic button

```html
...
```
