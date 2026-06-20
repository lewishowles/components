# `copy-content`

`copy-content` utilises `ui-button` to copy given content when activated.

Because this component utilises the `ui-button` component, [all props and slots from that component](/src/components/interaction/ui-button/ui-button.md) also apply.

## Slots

### `default`

- default: "Copy"

The text of the button. This should ideally explain what is being copied.

### `copy-success-label`

- default: "Copied"

The text to display briefly when content has been copied. Note that the label will be displayed overlaid on the button, to avoid content shift, but for safety if the message is longer than the button text, it will replace the content to ensure that the message is displayed correctly.

### `copy-error-label`

- default: "Error"

The text to display briefly when content couldn't be copied, either because there was no content to copy, or the browser refused. Note that the label will be displayed overlaid on the button, to avoid content shift, but for safety if the message is longer than the button text, it will replace the content to ensure that the message is displayed correctly.

## Props

### `content`

- type: `string`
- default: `null`

The content to copy to the user's clipboard when activated.

## Styling hooks

| Attribute                       | Element                | Notes                                         |
| ------------------------------- | ---------------------- | --------------------------------------------- |
| `data-component="copy-content"` | Root element           | Scope styles to this component                |
| `data-part="label"`             | Default label and icon | Visible when no copy operation is in progress |
| `data-part="success"`           | Success feedback       | Shown briefly after a successful copy         |
| `data-part="error"`             | Error feedback         | Shown briefly when copying fails              |
| `data-copied`                   | Root                   | Present while the success state is displayed  |

## Examples

### Copy content

```html
<copy-content v-bind="{ content: template }">Copy template</copy-content>
```
