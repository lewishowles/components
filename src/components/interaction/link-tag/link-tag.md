# `link-tag`

`link-tag` is an extension of a standard anchor.

## Slots

### `default`

The default slot contains the content to display in the link.

## Props

### `href`

- type: `string`
- **required**

The destination for this link.

### `external`

- type: `boolean`
- default: `false`

Whether this is an external link. If so, `target="_blank"` is added and an appropriate external icon is shown at the end of the link.

### `showExternalIcon`

- type: `boolean`
- default: `false`

When `external` is true, but an external icon is not desired, `showExternalIcon` can be set to false.

_Note that if a link is `external`, `showExternalIcon` is true and, `iconEnd` is defined, the external icon takes precedence._

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a link.

The icon is implemented using `<component :is="...">`, allowing the link to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find [the list of available icons in this project](/src/components/icon/icon.md), or you can use one that is globally registered in your project.

_Note that `start` and `end` depend on the current document direction._

### `iconOnly`

- type: `boolean`
- default: `false`

Whether to only show an icon (and not the associated text). If true, the text is hidden via an `sr-only` class, so is still accessible to screen readers and therefore important. The displayed icon is also shown at `1em` size when alone, to better fill the link.

## Examples

### Basic links

```html
<link-tag href="/">
	Visit the homepage
</link-tag>

<link-tag href="https://howles.dev" v-bind={ external: true }>
	See some cool projects
</link-tag>
```

### With an icon

```html
<link-tag href="/user/create" v-bind="{ iconStart: 'icon-plus' }">
	Add new user
</link-tag>

<link-tag href="/next" v-bind="{ iconEnd: 'icon-arrow-right' }">
	Next step
</link-tag>
```
