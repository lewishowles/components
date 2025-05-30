<template>
	<component-page>
		<template #title>
			Form checkbox
		</template>

		<template #introduction>
			<p><code>form-checkbox</code> is an extension of the standard <code>input[type=&quot;checkbox&quot;]</code>, with a consistent design and baked-in accessibility features.</p>
			<p>Supports <code>v-model</code> to bind the input's current value.</p>
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
			<component-prop id="prop-display-label">
				<template #name>
					displayLabel
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Whether to display the label. A label is still required for accessibility purposes.</p>
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

				<p>Any additional attributes to pass to the input itself, such as <code>required</code>.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>...</p>
			</component-slot>
			<component-slot id="slot-error">
				<template #name>
					error
				</template>

				<p>...</p>
			</component-slot>
			<component-slot id="slot-help">
				<template #name>
					help
				</template>

				<p>...</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value of the checkbox will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this checkbox.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-checkbox />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormCheckbox from "./fragments/playground-form-checkbox.vue";
</script>
