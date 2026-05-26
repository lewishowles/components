# `content-separator`

A standardised separator between content sections.

Use `tag="hr"` when the separator marks a break in content. The default `div` is purely visual.

## Props

### `tag`

- type: `string`
- default: `div`

The HTML element to render. Use `div` for a decorative visual rule, and `hr` for a separator that marks a break in content.

## Examples

### Decorative separator

```html
<content-separator />
```

### Thematic break

```html
<content-separator tag="hr" />
```
