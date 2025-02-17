# `image-tag`

Display an image, automatically handling broken images and displaying a fallback.

## Slots

### `fallback`

A slot provided to override the default fallback image.

## Props

### `src`

- type: `string`
- **required**

## Events

### `error`

Fired when an image load error occurs, and the `image-tag` would be showing the fallback.

## Examples

### Basic image

```html
<image-tag src="https://picsum.photos/300/300" />
```
