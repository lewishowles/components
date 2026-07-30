# `overlay-sheet`

The `overlay-sheet` component is a low-level building block for switching one live content tree between an inline panel and a native dialog sheet. It is used internally by [`floating-details`](/src/components/content/floating-details/floating-details.md), and [`dropdown-menu`](/src/components/interaction/dropdown-menu/dropdown-menu.md). Use those components for consumer-facing triggers and behaviour rather than reaching for `overlay-sheet` directly.

## Slots

### `default`

The content of the inline panel or sheet.

### `close-dialog-label`

- default: `Close dialog`

The accessible label for the sheet's close button.

## Props

### `isOpen`

- type: `boolean`
- required

Whether the owning component considers the surface open.

### `isSheet`

- type: `boolean`
- required

Whether to use the native dialog sheet presentation. When false, the default slot remains inline and the native dialog is closed.

### `label`

- type: `string`
- required

The accessible name for the sheet dialog.

### `closeWithEscape`

- type: `boolean`
- default: `true`

Whether pressing Escape requests dismissal of the sheet.

## Events

### `@dismiss`

Requests that the owning component dismiss the surface.

## Keyboard interaction

| Key      | Action                                                            |
| -------- | ----------------------------------------------------------------- |
| `Escape` | Request dismissal of the sheet when `closeWithEscape` is enabled. |

## Styling hooks

| Attribute                  | Element           | Notes               |
| -------------------------- | ----------------- | ------------------- |
| `data-part="sheet"`        | Native `<dialog>` | Sheet presentation  |
| `data-part="close-button"` | Close button      | Dismisses the sheet |

## Examples

### Basic usage

```html
<overlay-sheet v-bind="{ isOpen, isSheet }" label="Account details" @dismiss="closeDetails">
	Account details
</overlay-sheet>
```
