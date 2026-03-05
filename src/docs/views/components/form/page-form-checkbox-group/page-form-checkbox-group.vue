<template>
	<component-page>
		<template #title>
			Form checkbox group
		</template>

		<template #introduction>
			<p><code>form-checkbox-group</code> provides a convenient way to create a group of <code>radio</code> inputs.</p>
			<p>Supports <code>v-model</code> to bind the currently selected item's value.</p>
		</template>

		<component-props>
			<component-prop id="prop-options">
				<template #name>
					options
				</template>

				<template #type>
					Array|Object
				</template>

				<template #default-value>
					null
				</template>

				<p>The options to display as checkboxes can be provided in a number of formats for ease.</p>

				<ul>
					<li>An array of strings <code>[&quot;option1&quot;, &quot;option2&quot;, &quot;option3&quot;]</code>, in which case both the label and value are the same.</li>
					<li>An array of numbers <code>[1, 2, 3]</code>, in which case both the label and value are the same.</li>
					<li>An array of objects <code>[{ label: &quot;Label&quot;, value: &quot;value&quot; }]</code> where labels and values are explicitly defined.</li>
					<li>An array of objects combined with the <code>labelKey</code> and <code>valueKey</code> properties.</li>
					<li>An object <code>{ value: &quot;label&quot; }</code> where each key is the value of oan option, and each value is the label.</li>
				</ul>
			</component-prop>

			<component-prop id="prop-label-key">
				<template #name>
					labelKey
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					label
				</template>

				The key needed to find each option's label within its object. If an individual option is a string or number, this is ignored.
			</component-prop>

			<component-prop id="prop-value-key">
				<template #name>
					valueKey
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					value
				</template>

				The key needed to find each option's value within its object. If an individual option is a string or number, this is ignored.
			</component-prop>

			<component-prop id="prop-name">
				<template #name>
					name
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>A name for this checkbox group. If not set, the input ID is used.</p>
			</component-prop>

			<component-prop id="prop-id">
				<template #name>
					id
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any ID to apply to this checkbox group. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the label of the field.</p>
				<p><em>Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided.</em></p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>
					introduction
				</template>

				<p>Any additional text to introduce the options, which appears between the label and options.</p>
			</component-slot>

			<component-slot id="slot-error">
				<template #name>
					error
				</template>

				<p>Any error text to display below the field.</p>
			</component-slot>

			<component-slot id="slot-help">
				<template #name>
					help
				</template>

				<p>Any help text to display below the field.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value(s) of the selected checkbox(es) will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this checkbox group.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-checkbox-group />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormCheckboxGroup from "./fragments/playground-form-checkbox-group.vue";
</script>
