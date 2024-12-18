# `skeleton-loader`

`skeleton-loader` is used to build a skeleton loading indicator. Comprising one or more `skeleton-indicator` components, this wrapper provides an accessible label.

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

	<div class="flex gap-4">
		<skeleton-indicator class="size-10 rounded-full" />
	</div>
</skeleton-loader>
```
