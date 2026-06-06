<template>
	<component-page>
		<template #title>Content separator</template>

		<template #introduction>
			<p>A standardised separator between content sections.</p>
			<p>
				Use
				<code>tag=&quot;hr&quot;</code>
				when the separator marks a break in content. The default
				<code>div</code>
				is purely visual.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-tag">
				<template #name>tag</template>

				<template #type>String</template>

				<template #default-value>div</template>

				<p>
					The HTML element to render. Use
					<code>div</code>
					for a decorative visual rule, and
					<code>hr</code>
					for a separator that marks a break in content.
				</p>
			</component-prop>

			<component-prop id="prop-orientation">
				<template #name>orientation</template>

				<template #type>String</template>

				<template #default-value>horizontal</template>

				<p>
					One of
					<code>horizontal</code>
					or
					<code>vertical</code>
					. Controls the visual direction of the separator and, for
					<code>tag="hr"</code>
					, the value of
					<code>aria-orientation</code>
					.
				</p>
			</component-prop>
		</component-props>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="content-separator"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-content-separator />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundContentSeparator from "./fragments/playground-content-separator.vue";
</script>
