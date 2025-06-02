# `skeleton-loader`

`skeleton-loader` is used to build a skeleton loading indicator. Comprising one or more `skeleton-indicator` components, this wrapper provides an accessible label.

## Slots

### `default`

The content of the skeleton loader, primarily composed of `skeleton-indicator` components.

### `label`

The accessible label to describe this loader.

_Note that no default text is provided by design. Using a specific message related to what is loaded is strongly encouraged._

## Examples

### Simple skeleton loader

```html
<skeleton-loader>
	<skeleton-indicator class="size-10 rounded-full" />
</skeleton-loader>
```

### With a custom label

```html
<skeleton-loader>
	<template #label>
		Loading users…
	</template>

	<div class="flex flex-wrap gap-4">
		<skeleton-indicator class="size-10 rounded-full" />
		<skeleton-indicator class="size-10 rounded-full" />
		<skeleton-indicator class="size-10 rounded-full" />
		<skeleton-indicator class="size-10 rounded-full" />
	</div>
</skeleton-loader>
```
