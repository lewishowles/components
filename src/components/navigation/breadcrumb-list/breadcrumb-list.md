# `breadcrumb-list`

`breadcrumb-list` and its related `breadcrumb-item` allow you to provide a breadcrumb navigation trail to users. A breadcrumb trail should start from the "home" page, and end on the page above the current page, and all items should link to their relevant section.

## Props

### `label`

- type: `string`
- default: `Breadcrumb`

The label for the breadcrumbs, intended to explain to screen reader users the purpose of the navigation.

## Slots

### `default`

Intended to contain one or more `breadcrumb-item` components.

## Examples

### Basic navigation

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
