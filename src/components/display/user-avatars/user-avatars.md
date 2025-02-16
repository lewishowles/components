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

### `shape`

- type: `string`
- default: `round`

The shape of avatars to display. Available values include "round", "square", and "squircle". Anything else will default to "round".

### `size`

- type: `string`
- default: `size-10`

The size of the avatars to display, based on Tailwind size classes.

## Events

### `@click`

...

## Methods

### `method`

...

## Examples

### Basic button

```html
...
```
