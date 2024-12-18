# `tab-group`

`tab-group` represents a group of tabs and is used in conjunction with `tab-item`, which represents each tab in the group, to create a set of accessible tabbed content.

Tabs are a good way to help a user focus on the task at hand, organising what could be an overhwleming number of options into distinct groups. A tab should clearly label its contents, meaning the user has to do the minimum thinking to determine where to look for the item they need.

However, tabs may also mean a page is too complex, and other solutions should be considered.

Tabs shouldn’t be represented by icons only, which would increase the user’s mental load unnecessarily.

Finally, if at all possible, avoiding a large number of tabs is preferable, as it suggests that there is too much happening on a single screen.

If tabs only contain content, an Accordion may be a better choice.

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
