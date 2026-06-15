# `link-tag`

`link-tag` is an extension of a standard anchor.

## Slots

### `default`

The default slot contains the content to display in the link.

### `external-suffix`

When `external` is true, a visually hidden suffix is appended inside the link to inform screen reader users the link opens in a new tab.

- default: `(opens in new tab)`

## Props

### `href`

- type: `string`
- **required**

The destination for this link.

### `external`

- type: `boolean`
- default: `false`

Whether this is an external link. If so, `target="_blank"`, `rel="noopener noreferrer"`, an external icon, and a visually hidden "(opens in new tab)" suffix are all added automatically.

### `showExternalIcon`

- type: `boolean`
- default: `true`

When `external` is true, but an external icon is not desired, `showExternalIcon` can be set to false.

_Note that if a link is `external`, `showExternalIcon` is true and `iconEnd` is defined, the external icon takes precedence._

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a link.

Built-in library icons can be used by name. You can find [the list of available icons in this project](/src/components/icon/icon.md). Custom icon names must refer to components registered by the consuming app.

_Note that `start` and `end` depend on the current document direction._

### `iconOnly`

- type: `boolean`
- default: `false`

Whether to only show an icon (and not the associated text). If true, the text is hidden via an `sr-only` class, so is still accessible to screen readers and therefore important. The displayed icon is also shown at `1em` size when alone, to better fill the link.

## Styling hooks

| Attribute                     | Element       | Notes                                     |
| ----------------------------- | ------------- | ----------------------------------------- |
| `data-component="link-tag"`   | Root `<a>`    | Scope styles to this component            |
| `data-external`               | Root          | Present when `external` is `true`         |
| `data-part="icon-start"`      | Start icon    | Present when `iconStart` is set           |
| `data-part="label"`           | Label         | The link text (always present)            |
| `data-part="icon-end"`        | End icon      | Present when `iconEnd` is set             |
| `data-part="icon-external"`   | External icon | Present when `external` and icon is shown |
| `data-part="external-suffix"` | Hidden suffix | Present when `external` is `true`         |

## Examples

### Basic links

```html
<link-tag href="/">Visit the homepage</link-tag>

<link-tag href="https://howles.dev" v-bind="{ external: true }">See some cool projects</link-tag>
```

### External link with custom suffix

```html
<link-tag href="https://howles.dev" v-bind="{ external: true }">
	See some cool projects

	<template #external-suffix>(new tab)</template>
</link-tag>
```

### With an icon

```html
<link-tag href="/user/create" v-bind="{ iconStart: 'icon-plus' }">Add new user</link-tag>

<link-tag href="/next" v-bind="{ iconEnd: 'icon-arrow-right' }">Next step</link-tag>
```
