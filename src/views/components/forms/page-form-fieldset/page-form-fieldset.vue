<template>
	<component-page>
		<template #title>
			Form fieldset
		</template>

		<template #introduction>
			<p>A fieldset represents a group of fields, containing a title and optional, but preferred, introduction.</p>

			<p>When deciding whether to group fields, ideally if some fields are grouped, all should be, otherwise the form could look incomplete.</p>

			<p><code>form-fieldset</code> automatically includes <code>form-layout</code> around its <code>default</code> content.</p>
		</template>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name>
					headingLevel
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					h2
				</template>

				<p>The heading level to use for this fieldset.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>
					title
				</template>

				<p>The title of this section, outlining the purpose of the grouping.</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>
					introduction
				</template>

				<p>Any additional information relating to this group of fields.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The content of the fieldset, which will be wrapped in a <code><router-link v-bind="{ to: '/forms/form-layout' }">form-layout</router-link></code> component.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-form-fieldset />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFieldset from "./fragments/playground-form-fieldset.vue";
</script>
