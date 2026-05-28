<template>
	<component-page>
		<template #title> Content card </template>

		<template #introduction>
			<p>
				<code>content-card</code> groups related content in a bordered card with optional header and
				footer areas.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-title">
				<template #name> title </template>

				<p>The card title. Rendered inside the heading level set by <code>headingLevel</code>.</p>
			</component-slot>

			<component-slot id="slot-icon">
				<template #name> icon </template>

				<p>Optional icon content shown before the title in the default header layout.</p>
			</component-slot>

			<component-slot id="slot-header-additional">
				<template #name> header-additional </template>

				<p>Optional content shown at the end of the default header layout.</p>
			</component-slot>

			<component-slot id="slot-header">
				<template #name> header </template>

				<p>
					Optional custom header content. This replaces the default header layout, but remains
					inside the styled header wrapper.
				</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name> default </template>

				<p>The main card content.</p>
			</component-slot>

			<component-slot id="slot-footer">
				<template #name> footer </template>

				<p>Optional footer content.</p>
			</component-slot>
		</component-slots>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name> headingLevel </template>

				<template #type> String </template>

				<template #default-value> h2 </template>

				<p>The heading level to use for the title.</p>
			</component-prop>

			<component-prop id="prop-footer-variant">
				<template #name> footerVariant </template>

				<template #type> String </template>

				<template #default-value> well </template>

				<p>The footer style to use. Supports <code>well</code> and <code>plain</code>.</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name> iconClasses </template>

				<template #type> String | Array | Object </template>

				<template #default-value> text-purple-800 </template>

				<p>Classes to apply around the icon slot.</p>
			</component-prop>
		</component-props>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="content-card"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-header">
				<template #attribute>data-part="header"</template>

				<p>The header region, containing the title, icon, and any additional header content.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-body">
				<template #attribute>data-part="body"</template>

				<p>The main body region of the card.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-footer">
				<template #attribute>data-part="footer"</template>

				<p>The footer region of the card.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-content-card />
			<playground-content-card-header />
			<playground-content-card-footer />
			<playground-content-card-custom-header />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundContentCard from "./fragments/playground-content-card.vue";
import PlaygroundContentCardCustomHeader from "./fragments/playground-content-card-custom-header.vue";
import PlaygroundContentCardFooter from "./fragments/playground-content-card-footer.vue";
import PlaygroundContentCardHeader from "./fragments/playground-content-card-header.vue";
</script>
