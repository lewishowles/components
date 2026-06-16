<template>
	<component-page>
		<template #title>Content card</template>

		<template #introduction>
			<p>
				<code>content-card</code>
				groups related content in a bordered card. Build it up using the companion components:
			</p>

			<ul>
				<li>
					<code>content-card-header</code>
					, a header with title, icon, and additional header slots
				</li>
				<li>
					<code>content-card-section</code>
					, a bordered body section — use multiple sections to divide content
				</li>
				<li>
					<code>content-card-footer</code>
					, a footer region
				</li>
			</ul>
		</template>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name>headingLevel</template>

				<template #type>String</template>

				<template #default-value>h2</template>

				<p>
					<code>content-card-header</code>
					— the heading level to use for the title.
				</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name>iconClasses</template>

				<template #type>String | Array | Object</template>

				<template #default-value>text-primary</template>

				<p>
					<code>content-card-header</code>
					— classes to apply around the icon slot.
				</p>
			</component-prop>
		</component-props>

		<component-slots title="content-card-header slots">
			<component-slot id="slot-title">
				<template #name>title</template>

				<p>
					The card title. Rendered inside the heading level set by
					<code>headingLevel</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-icon">
				<template #name>icon</template>

				<p>Optional icon content shown before the title in the default header layout.</p>
			</component-slot>

			<component-slot id="slot-header-additional">
				<template #name>header-additional</template>

				<p>Optional content shown at the end of the default header layout.</p>
			</component-slot>

			<component-slot id="slot-header">
				<template #name>header</template>

				<p>
					Optional custom header content. This replaces the default title layout, but remains inside
					the styled header wrapper.
				</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component-card">
				<template #attribute>data-component="content-card"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-component-header">
				<template #attribute>data-component="content-card-header"</template>

				<p>Present on the header companion root.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-component-section">
				<template #attribute>data-component="content-card-section"</template>

				<p>Present on each section companion root.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-component-footer">
				<template #attribute>data-component="content-card-footer"</template>

				<p>Present on the footer companion root.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-header">
				<template #attribute>data-part="header"</template>

				<p>The header region.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-section">
				<template #attribute>data-part="section"</template>

				<p>Each body section.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-footer">
				<template #attribute>data-part="footer"</template>

				<p>The footer region.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-content-card />
			<playground-content-card-sections />
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
import PlaygroundContentCardSections from "./fragments/playground-content-card-sections.vue";
</script>
