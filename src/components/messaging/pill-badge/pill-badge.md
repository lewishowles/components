# `pill-badge`

The `pill-badge` is great for showing statuses or changes in data.

## Slots

### `default`

The default slot contains the text of the label.

## Props

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a badge.

Built-in library icons can be used by name. You can find [the list of available icons in this project](/src/components/icon/icon.md). Custom icon names must refer to components registered by the consuming app.

_Note that `start` and `end` depend on the current document direction._

### `colour`

- type: `string`
- default: `grey`
- available values: `grey`, `danger`/`red`, `orange`, `warning`/`yellow`, `success`/`green`, `teal`, `info`/`blue`, `indigo`, `primary`, `pink`

The colour of this badge.

## Styling hooks

| Attribute                     | Element | Notes                          |
| ----------------------------- | ------- | ------------------------------ |
| `data-component="pill-badge"` | Root    | Scope styles to this component |

## Examples

### A basic badge

```html
<pill-badge theme="green">Green</pill-badge>
```

### With an icon

```html
<pill-badge v-bind="{ colour: 'green', iconStart: 'icon-arrow-up' }">Reload</pill-badge>

<pill-badge v-bind="{ colour: 'red', iconEnd: 'icon-arrow-down' }">Next step</pill-badge>
```
