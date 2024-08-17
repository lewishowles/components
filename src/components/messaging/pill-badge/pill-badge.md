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

The icon is implemented using `<component :is="...">`, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find [the list of available icons in this project](/src/components/icon/icon.md), or you can use one that is globally registered in your project.

_Note that `start` and `end` depend on the current document direction._

### `colour`

- type: `string`
- default: `grey`
- available values: `grey`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`

The colour of this badge.

## Examples

### A basic badge

```html
<pill-badge theme="green">
	Green
</pill-badge>
```

### With an icon

```html
<pill-badge v-bind="{ colour: 'green', iconStart: 'icon-arrow-up' }">
	Reload
</pill-badge>

<pill-badge v-bind="{ colour: 'red', iconEnd: 'icon-arrow-down' }">
	Next step
</pill-badge>
```
