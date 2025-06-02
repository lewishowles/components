<template>
	<component-page>
		<template #title>
			Tab group
		</template>

		<template #introduction>
			<p><code>tab-group</code> represents a group of tabs and is used in conjunction with <code>tab-item</code>, which represents each tab in the group, to create a set of accessible tabbed content.</p>
			<p>Note that neither <code>tab-group</code> nor <code>tab-item</code> can be used without the other, hence their documentation being combined.</p>
			<p>Tabs are a good way to help a user focus on the task at hand, organising what could be an overwhelming number of options into distinct groups. A tab should clearly label its contents, meaning the user has to do the minimum thinking to determine where to look for the item they need.</p>
			<p>However, tabs may also mean a page is too complex, and other solutions should be considered.</p>
			<p>Tabs shouldn’t be represented by icons only, which would increase the user’s mental load unnecessarily.</p>
			<p>Finally, if at all possible, avoiding a large number of tabs is preferable, as it suggests that there is too much happening on a single screen.</p>
			<p>If tabs only contain content, an Accordion may be a better choice.</p>
		</template>

		<component-props>
			<component-prop id="prop-remember-selection">
				<template #name>
					rememberSelection
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to remember the selected tab, updating the URL and allowing the appropriate tab to be reinstated on load. Note that when using this feature, tabs must be given custom IDs, as opposed to the default IDs, which are randomly generated.</p>
			</component-prop>

			<component-prop id="prop-id-tab-item">
				<template #name>
					id (<code>tab-item</code>)
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any ID to apply to this tab. This can be used in conjunction with prop <code>rememberSelection</code> to reinstate tabs on page refresh. When providing an ID, ensure that it is unique.</p>
			</component-prop>

			<component-prop id="prop-initially-active-tab-item">
				<template #name>
					initiallyActive (<code>tab-item</code>)
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether this tab is initially active.</p>
			</component-prop>

			<component-prop id="prop-icon-tab-item">
				<template #name>
					icon (<code>tab-item</code>)
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>An icon to display with the tab button.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The <code>default</code> slot contains the <code>tab-item</code> components that represent the tabs.</p>
			</component-slot>

			<component-slot id="slot-tab-item-default">
				<template #name>
					default (<code>tab-item</code>)
				</template>

				<p>The <code>default</code> slot for <code>tab-item</code> contains the content of the tab.</p>
			</component-slot>

			<component-slot id="slot-tab-item-label">
				<template #name>
					label (<code>tab-item</code>)
				</template>

				<p>The label for this tab, to be displayed in the tab bar.</p>
			</component-slot>
		</component-slots>

		<component-provides>
			<template #introduction>
				<p><code>tab-group</code> provides methods to enable other components to mimic a <code>tab-item</code>. If choosing to do so, however, you must ensure that all of the same accessibility features are present.</p>
			</template>

			<component-provide id="provide-register-tab">
				<template #name>
					<code>registerTab</code>
				</template>

				<p>Register an individual tab with the group.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>tab</code></td>
							<td><code>object</code></td>
							<td>The details of the tab to be registered.</td>
						</tr>
						<tr>
							<td><code>tab.tabId</code></td>
							<td><code>string</code></td>
							<td>A unique ID for this tab, used to link a tab and its panel together.</td>
						</tr>
						<tr>
							<td><code>tab.panelId</code></td>
							<td><code>string</code></td>
							<td>A unique ID for this tab's panel (or content), used to link a tab and its panel together.</td>
						</tr>
						<tr>
							<td><code>tab.active</code></td>
							<td><code>boolean</code></td>
							<td>Whether this tab is active when it initialises.</td>
						</tr>
						<tr>
							<td><code>tab.icon</code></td>
							<td><code>string</code></td>
							<td>Any icon to display beside the label in the tab bar, e.g. <code>icon-user</code>.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>

			<component-provide id="provide-active-tab-id">
				<template #name>
					<code>activeTabId</code>
				</template>

				<p>A <code>ref</code> representing the currently active tab ID, allowing individual tabs to track whether they are active.</p>
			</component-provide>
		</component-provides>

		<component-playgrounds>
			<playground-tab-group />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundTabGroup from "./fragments/playground-tab-group.vue";
</script>
