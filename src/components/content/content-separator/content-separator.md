# `content-separator`

A standardised separator between content sections.

Use `tag="hr"` when the separator marks a break in content. The default `div` is purely visual.

## Props

### `tag`

- type: `string`
- default: `div`

The HTML element to render. Use `div` for a decorative visual rule, and `hr` for a separator that marks a break in content.

### `orientation`

- type: `string`
- default: `horizontal`

One of `horizontal` or `vertical`. Controls the visual direction of the separator and, for `tag="hr"`, the value of `aria-orientation`.

## Styling hooks

| Attribute                            | Element | Notes                          |
| ------------------------------------ | ------- | ------------------------------ |
| `data-component="content-separator"` | Root    | Scope styles to this component |

## Examples

### Decorative separator

```html
<content-separator />
```

### Thematic break

```html
<content-separator tag="hr" />
```

### Vertical separator

```html
<content-separator orientation="vertical" />
```
