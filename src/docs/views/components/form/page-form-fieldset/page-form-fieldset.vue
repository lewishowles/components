<template>
	<component-page>
		<template #title>Form fieldset</template>

		<template #introduction>
			<p>
				A fieldset represents a group of fields, containing a title and optional, but preferred,
				introduction.
			</p>

			<p>
				When deciding whether to group fields, ideally if some fields are grouped, all should be,
				otherwise the form could look incomplete.
			</p>

			<p>
				<code>form-fieldset</code>
				automatically includes
				<code>form-layout</code>
				around its
				<code>default</code>
				content.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name>headingLevel</template>

				<template #type>String</template>

				<template #default-value>h2</template>

				<p>The heading level to use for this fieldset.</p>
			</component-prop>

			<component-prop id="prop-title-classes">
				<template #name>titleClasses</template>

				<template #type>String | Array | Object</template>

				<template #default-value>null</template>

				<p>
					Additional classes applied to the title, merged on top of the base styles via
					<code>cn</code>
					. Conflicting classes override the defaults. Always wins over compact density.
				</p>
			</component-prop>

			<component-prop id="prop-layout-classes">
				<template #name>layoutClasses</template>

				<template #type>String</template>

				<template #default-value>""</template>

				<p>
					Additional classes passed to the inner
					<code>form-layout</code>
					, merged via
					<code>cn</code>
					to resolve Tailwind conflicts. Always wins over compact density.
				</p>
			</component-prop>
		</component-props>

		<component-provides>
			<template #introduction>
				<p>
					When
					<code>form-fieldset</code>
					is inside a
					<code>&lt;form-wrapper compact&gt;</code>
					, the heading size and the header block spacing reduce. A
					<code>titleClasses</code>
					override always wins.
				</p>
			</template>
		</component-provides>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>title</template>

				<p>The title of this section, outlining the purpose of the grouping.</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>introduction</template>

				<p>Any additional information relating to this group of fields.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>default</template>

				<p>
					The content of the fieldset, which will be wrapped in a
					<router-link :to="{ name: 'form-layout' }">
						<code>form-layout</code>
					</router-link>
					component.
				</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-fieldset"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-fieldset />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFieldset from "./fragments/playground-form-fieldset.vue";
</script>
