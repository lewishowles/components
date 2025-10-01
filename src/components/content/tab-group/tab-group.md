# `tab-group`

`tab-group` represents a group of tabs and is used in conjunction with `tab-item`, which represents each tab in the group, to create a set of accessible tabbed content.

Note that neither `tab-group` nor `tab-item` can be used without the other, hence their documentation being combined.

Tabs are a good way to help a user focus on the task at hand, organising what could be an overwhelming number of options into distinct groups. A tab should clearly label its contents, meaning the user has to do the minimum thinking to determine where to look for the item they need.

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

## Props

### `rememberSelection`

- type: `boolean`
- default: `false`

Whether to remember the selected tab, updating the URL and allowing the appropriate tab to be reinstated on load. Note that when using this feature, tabs must be given custom IDs, as opposed to the default IDs, which are randomly generated.

### `wrap`

- type: `boolean`
- default: `false`

Whether to wrap tabs, or display them in a single line with overflow indicators (default).

## Props (`tab-item`)

### `id`

- type: `string`
- default: `null`

Any ID to apply to this tab. This can be used in conjunction with prop `rememberSelection` to reinstate tabs on page refresh. When providing an ID, ensure that it is unique.

### `initiallyActive`

- type: `boolean`
- default: `false`

Whether this tab is initially active.

### `icon`

- type: `string`
- default: `null`

An icon to display with the tab button.

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
