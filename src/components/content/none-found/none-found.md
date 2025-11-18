# `none-found`

`none-found` is a convenient way to show an attention-grabbing message to the user. Designed to be used in list contexts when no items can be displayed—either through error or filtering—`none-found` also includes an area for actions, giving the user an important guide to what their next step could be.

## Slots

### `title`

The title of the message.

### `default`

The content of the message, explaining what is missing, and, if possible, why.

### `actions`

Any actions to provide to the user, such as a create button, or a reload button.

## Props

### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use for the title.

## Examples

### Basic message

```html
<none-found>
	<template #title>
		No users found
	</template>

	There are no users pending deletion.
</none-found>
```

### With actions

```html
<none-found>
	<template #title>
		No users found
	</template>

	No users could be found matching "{{ searchQuery }}".

	<template #actions>
		<ui-button class="button--muted" @click="resetSearch">
			Reset search
		</ui-button>
	</template>
</none-found>
```
