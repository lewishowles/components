# `loading-skeleton`

`loading-skeleton` is used to build a skeleton loading indicator. Comprising one or more `loading-skeleton-indicator` components, this wrapper provides an accessible label.

## Slots

### `default`

The content of the skeleton loader, primarily composed of `loading-skeleton-indicator` components.

### `label`

The accessible label to describe this loader.

_Note that no default text is provided by design. Using a specific message related to what is loaded is strongly encouraged._

## Examples

### Simple skeleton loader

```html
<loading-skeleton>
	<loading-skeleton-indicator class="size-10 rounded-full" />
</loading-skeleton>
```

### With a custom label

```html
<loading-skeleton>
	<template #label>
		Loading users…
	</template>

	<div class="flex flex-wrap gap-4">
		<loading-skeleton-indicator class="size-10 rounded-full" />
		<loading-skeleton-indicator class="size-10 rounded-full" />
		<loading-skeleton-indicator class="size-10 rounded-full" />
		<loading-skeleton-indicator class="size-10 rounded-full" />
	</div>
</loading-skeleton>
```
