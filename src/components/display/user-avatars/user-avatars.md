# `user-avatars`

`user-avatars` displays a list of provided avatars, with additional information such as their name or initials as provided.

## Props

### `users`

- type: `array`
- default: `[]`

The list of users to display. By default, the format of provided users should be as follows:

```javascript
[
	{ name: "Sophie Wardhaugh", initials: "SW", avatar: "/absolute/path/to/avatar" }
	...
]
```

Any of the information can be omitted, and the component will do its best to compensate.

- If no name is provided, the tooltip will show the initials.
- If no initials are provided, they will be generated from the name.
- If no avatar is provided, the initials will be shown.
- Without a name or initials, no tooltip is included.
- If an avatar is provided, but fails to load, the user will fall back to the initials if possible.

### `shape`

- type: `string`
- default: `round`

The shape of avatars to display. Available values include "round", "square", and "squircle" (or "roundangle"). Anything else will default to "round".

### `size`

- type: `string`
- default: `size-10`

The size of the avatars to display, based on Tailwind size classes.

### `overlap`

- type: `boolean`
- default: `null`

Whether avatars should overlap. If they do, they're given an outline so that the images don't clash.

Overlap is true by default for "circle" avatars, and false by default for "square" and "squircle", but a value provided here will take precedence.

### `initialColourClasses`

- type: `string`
- default: `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`

### `initialOutlineClasses`

- type: `string`
- default: `outline-white dark:outline-purple-200`

## Examples

### Basic avatars

```html
<user-avatars v-bind="{ users }" />
```
