# `breadcrumb-item`

`breadcrumb-item` represents the individual breadcrumbs in a `breadcrumb-list`, and each should be a link to its relevant section.

## Slots

### `default`

The text content of the breadcrumb.

## Props

### `href`

- type: `string`
- **required**

The link to the breadcrumb item's section.

## Examples

### Basic button

```html
<breadcrumb-list>
	<breadcrumb-item href="/">
		Admin
	</breadcrumb-item>
	<breadcrumb-item href="/users">
		Users
	</breadcrumb-item>
</breadcrumb-list>
```
