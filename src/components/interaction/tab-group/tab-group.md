# `tab-group`

`tab-group` represents a group of tabs and is used in conjunction with `tab-item`, which represents each tab in the group, to create a set of accessible tabbed content.

## Slots

### `default`

The `default` slot contains the `tab-item` components that represent the tabs.

## Slots (`tab-item`)

### `default`

The `default` slot for `tab-item` contains the content of the tab.

### `label`

The label for this tab, to be displayed in the tab bar.

## Examples

### Basic tabs

```html
<tab-group>
	<tab-item>
		<template #label>
			Log in
		</template>

		<user-log-in />
	</tab-item>
	<tab-item>
		<template #label>
			Register
		</template>

		<user-register />
	</tab-item>
</tab-group>
```

## To do

- Generate an `id` for each tab
- `v-model` to bind the currently selected tab
- Allow the default tab to be defined via the `v-model`
