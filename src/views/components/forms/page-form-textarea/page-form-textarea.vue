<template>
	<component-page>
		<template #title>
			Form textarea
		</template>

		<template #introduction>
			<p><code>form-textarea</code> is an extension of the standard <code>textarea</code> tag, with a consistent design and baked-in accessibility features.</p>
			<p>Supports <code>v-model</code> to bind the textarea's current value.</p>
		</template>

		<component-props>
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
			<component-prop id="prop-placeholder">
				<template #name>
					placeholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any placeholder to show in the textarea. Do not use a placeholder for critical information. Always use the label and help text as priorities.</p>
			</component-prop>
			<component-prop id="prop-input-attributes">
				<template #name>
					input-attributes
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any additional attributes to pass to the textarea itself, such as <code>required</code> or <code>autocomplete</code>.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the label of the textarea.</p>
				<p><em>Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided.</em></p>
			</component-slot>
			<component-slot id="slot-error">
				<template #name>
					error
				</template>

				<p>Any error text to display below the textarea.</p>
			</component-slot>
			<component-slot id="slot-help">
				<template #name>
					help
				</template>

				<p>Any help text to display below the textarea.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value of the textarea will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this textarea.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-textarea />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormTextarea from "./fragments/playground-form-textarea.vue";
</script>
