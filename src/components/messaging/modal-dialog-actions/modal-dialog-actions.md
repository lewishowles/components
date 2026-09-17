# `modal-dialog-actions`

Display a selection of actions (primarily buttons) for a dialog in a standardised format.

## Styling hooks

| Attribute                               | Element      | Notes                          |
| --------------------------------------- | ------------ | ------------------------------ |
| `data-component="modal-dialog-actions"` | Root `<div>` | Scope styles to this component |
| `data-part="actions"`                   | Root `<div>` | Container for dialog actions   |

## Slots

### `default`

The actions to display.

## Examples

```html
<modal-dialog-actions>
	<ui-button class="button--primary">Delete user {{ username }}</ui-button>
</modal-dialog-actions>
```
