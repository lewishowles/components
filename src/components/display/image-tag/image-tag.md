# `image-tag`

Display an image with automatic fallback where an image doesn't load.

## Slots

### `fallback`

A slot provided to override the default fallback image.

## Props

### `src`

- type: `string`
- **required**

The URL to the image, which is applied directly to the underlying `img` tag.

## Events

### `error`

Fired when an image load error occurs, and the `image-tag` would be showing the fallback.

## Examples

### Basic image

```html
<image-tag src="https://picsum.photos/300/300" />
```
