<template>
	<component-page>
		<template #title>
			Form select
		</template>

		<template #introduction>
			<p><code>form-select</code> is an extension of the standard <code>select</code> tag, with a consistent design and baked-in accessibility features.</p>
		</template>

		<component-props>
			<component-prop id="prop-options">
				<template #name>
					options
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					[]
				</template>

				<p>The options for this select can be provided in a number of formats for ease.</p>

				<ul>
					<li>An array of strings <code>[&quot;option1&quot;, &quot;option2&quot;, &quot;option3&quot;]</code>, in which case both the label and value are the same.</li>
					<li>An array of numbers <code>[1, 2, 3]</code>, in which case both the label and value are the same.</li>
					<li>An object <code>{ value: &quot;label&quot; }</code> where each key is the value of oan option, and each value is the label.</li>
					<li>An array of objects <code>[{ label: &quot;Label&quot;, value: &quot;value&quot; }]</code> where labels and values are explicitly defined.</li>
				</ul>

				<p>It is possible to combine both array options, but generally not recommended.</p>
			</component-prop>

			<component-prop id="prop-allow-empty">
				<template #name>
					allowEmpty
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to allow an empty option, the label of which can be provided via the <code>empty-option-label</code> slot.</p>
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

				<p>Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.</p>
			</component-prop>

			<component-prop id="prop-input-attributes">
				<template #name>
					inputAttributes
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any additional attributes to pass to the field itself, such as <code>required</code>.</p>
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

				<p>Any additional text to introduce this input, which appears between the label and the input.</p>
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

				<p>The current value of the select will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this select.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-select />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormSelect from "./fragments/playground-form-select.vue";
</script>
