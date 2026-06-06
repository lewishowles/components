# `content-card`

`content-card` groups related content in a bordered card with optional header and footer areas.

## Slots

### `title`

The card title. Rendered inside the heading level set by `headingLevel`.

### `icon`

Optional icon content shown before the title in the default header layout.

### `header-additional`

Optional content shown at the end of the default header layout.

### `header`

Optional custom header content. This replaces the default header layout, but remains inside the styled header wrapper.

### `default`

The main card content.

### `footer`

Optional footer content.

## Props

### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use for the title.

### `footerClasses`

- type: `string` | `array` | `object`
- default: `null`

Additional classes to apply to the footer, merged on top of the base styles (border, rounding, flex, padding, text-sm). Any provided classes that conflict with base classes will override as necessary.

### `iconClasses`

- type: `string` | `array` | `object`
- default: `text-primary`

Classes to apply around the icon slot.

## Styling hooks

| Attribute                       | Element | Notes                          |
| ------------------------------- | ------- | ------------------------------ |
| `data-component="content-card"` | Root    | Scope styles to this component |
| `data-part="header"`            | Header  | The header region              |
| `data-part="body"`              | Body    | The main body region           |
| `data-part="footer"`            | Footer  | The footer region              |

## Examples

### Basic card

```html
<content-card>
	<template #title>Card title</template>

	Card content
</content-card>
```

### Card with footer

```html
<content-card>
	<template #title>Card title</template>

	Card content

	<template #footer>Card footer</template>
</content-card>
```

### Custom header

```html
<content-card>
	<template #header>Custom header</template>

	Card content
</content-card>
```
