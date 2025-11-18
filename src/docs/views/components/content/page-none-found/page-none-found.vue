<template>
	<component-page>
		<template #title>
			None found
		</template>

		<template #introduction>
			<p><code>none-found</code> is a convenient way to show an attention-grabbing message to the user. Designed to be used in list contexts when no items can be displayed—either through error or filtering—<code>none-found</code> also includes an area for actions, giving the user an important guide to what their next step could be.</p>
		</template>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>
					title
				</template>

				<p>The title of the message.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The content of the message, explaining what is missing, and, if possible, why.</p>
			</component-slot>

			<component-slot id="slot-actions">
				<template #name>
					actions
				</template>

				<p>Any actions to provide to the user, such as a create button, or a reload button.</p>
			</component-slot>
		</component-slots>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name>
					headingLevel
				</template>

				<template #type>
					string
				</template>

				<template #default-value>
					h2
				</template>

				<p>The heading level to use for the title.</p>
			</component-prop>
		</component-props>

		<component-playgrounds>
			<playground-none-found />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundNoneFound from "./fragments/playground-none-found.vue";
</script>
