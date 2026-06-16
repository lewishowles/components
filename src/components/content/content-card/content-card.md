# `content-card`

`content-card` groups related content in a bordered card. Build it up using the companion components:

- `content-card-header`, a header with title, icon, and additional header slots
- `content-card-section`, a bordered body section — use multiple sections to divide content
- `content-card-footer`, a footer region

## `content-card`

No props. Accepts only a default slot containing companion components.

## `content-card-header`

### Slots

#### `title`

The card title, rendered inside the element set by `headingLevel`.

#### `icon`

Optional icon shown before the title.

#### `header-additional`

Optional content shown at the end of the default header layout.

#### `header`

Optional custom header content. Replaces the default title layout, but remains inside the styled header wrapper.

### Props

#### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use for the title.

#### `iconClasses`

- type: `string` | `array` | `object`
- default: `text-primary`

Classes to apply around the icon slot.

## `content-card-section`

No props. Accepts a default slot for section content. Sections stack with collapsed borders and automatic rounding on the outermost edges.

## `content-card-footer`

No props. Pass `class` directly to override or extend the base styles (border, rounding, flex, padding, text-sm).

## Styling hooks

| Attribute                               | Element           | Notes                          |
| --------------------------------------- | ----------------- | ------------------------------ |
| `data-component="content-card"`         | Root              | Scope styles to this component |
| `data-component="content-card-header"`  | Header companion  | —                              |
| `data-component="content-card-section"` | Section companion | —                              |
| `data-component="content-card-footer"`  | Footer companion  | —                              |
| `data-part="header"`                    | Header            | —                              |
| `data-part="section"`                   | Section           | —                              |
| `data-part="footer"`                    | Footer            | —                              |

## Examples

### Basic card

```html
<content-card>
	<content-card-header>
		<template #title>Card title</template>
	</content-card-header>

	<content-card-section>Card content</content-card-section>
</content-card>
```

### Multiple sections

```html
<content-card>
	<content-card-header>
		<template #title>Card title</template>
	</content-card-header>

	<content-card-section>First section</content-card-section>

	<content-card-section>Second section</content-card-section>
</content-card>
```

### Card with footer

```html
<content-card>
	<content-card-header>
		<template #title>Card title</template>
	</content-card-header>

	<content-card-section>Card content</content-card-section>

	<content-card-footer>Card footer</content-card-footer>
</content-card>
```

### Custom header

```html
<content-card>
	<content-card-header>
		<template #header>Custom header</template>
	</content-card-header>

	<content-card-section>Card content</content-card-section>
</content-card>
```
