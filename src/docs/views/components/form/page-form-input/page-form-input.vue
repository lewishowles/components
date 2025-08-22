<template>
	<component-page>
		<template #title>
			Form input
		</template>

		<template #introduction>
			<p><code>form-input</code> is an extension of the standard <code>input</code> tag, with a consistent design and baked-in accessibility features.</p>
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

				<p>Any placeholder to show in the field. Do not use a placeholder for critical information. Always use the label and help text as priorities.</p>
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

				<p>Any additional attributes to pass to the field itself, such as <code>required</code> or <code>autocomplete</code>. This can also be used to change the type of the field, such as to <code>email</code>.</p>
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
			<component-slot id="slot-prefix">
				<template #name>
					prefix
				</template>

				<p>Any element—text or icon—to place at the start of the field.</p>
				<p>
					You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>
				</p>
			</component-slot>
			<component-slot id="slot-suffix">
				<template #name>
					suffix
				</template>

				<p>Any element—text or icon—to place at the end of the field.</p>
				<p>
					You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>
				</p>
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

				<p>The current value of the input will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this input.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-input />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormInput from "./fragments/playground-form-input.vue";
</script>
