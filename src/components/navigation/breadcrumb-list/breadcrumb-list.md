# `breadcrumb-list`

`breadcrumb-list` and its related `breadcrumb-item` allow you to provide a breadcrumb navigation trail to users. A breadcrumb trail should start from the "home" page, and end on the page above the current page, and all items should link to their relevant section.

Long breadcrumb trails remain on one line and scroll horizontally when they are wider than their container. The list initially positions at its end so the latest breadcrumb is visible, and edge indicators show when more content is available while scrolling.

## Props

### `label`

- type: `string`
- default: `Breadcrumb`

The label for the breadcrumbs, intended to explain to screen reader users the purpose of the navigation.

## Slots

### `default`

Intended to contain one or more `breadcrumb-item` components.

## Styling hooks

| Attribute                          | Element | Notes                          |
| ---------------------------------- | ------- | ------------------------------ |
| `data-component="breadcrumb-list"` | Root    | Scope styles to this component |
| `data-part="list"`                 | `<ol>`  | The list of breadcrumb items   |

## Examples

### Basic navigation

```html
<breadcrumb-list>
	<breadcrumb-item href="/">Admin</breadcrumb-item>
	<breadcrumb-item href="/users">Users</breadcrumb-item>
</breadcrumb-list>
```
