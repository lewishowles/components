# `breadcrumb-item`

`breadcrumb-item` represents the individual breadcrumbs in a `breadcrumb-list`. Each item should link to its relevant section, except for the current page which should not link to itself.

## Slots

### `default`

The text content of the breadcrumb.

## Props

### `href`

- type: `string`
- default: `undefined`

The link to the breadcrumb item's section. Required when `current` is false.

### `current`

- type: `boolean`
- default: `false`

Whether this item represents the current page. When true, renders as a non-interactive `<span aria-current="page">` rather than a link. The current page should not link to itself.

## Styling hooks

| Attribute                          | Element | Notes                                      |
| ---------------------------------- | ------- | ------------------------------------------ |
| `data-component="breadcrumb-item"` | Root    | Scope styles to this component             |
| `data-current`                     | Root    | Present when this item is the current page |

## Examples

### Basic breadcrumb trail

```html
<breadcrumb-list>
	<breadcrumb-item href="/"> Admin </breadcrumb-item>
	<breadcrumb-item href="/users"> Users </breadcrumb-item>
	<breadcrumb-item :current="true"> Lewis Howles </breadcrumb-item>
</breadcrumb-list>
```
